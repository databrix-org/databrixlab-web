from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
from django.core.exceptions import ValidationError


# Create your models here.
class CustomUserModel(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_("Email Address"), unique=True, max_length=255)
    first_name = models.CharField(_("First Name"), max_length=100)
    last_name = models.CharField(_("Last Name"), max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['first_name', 'last_name']),
        ]

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return self.first_name


class Course(models.Model):
    """
    Represents a course with its JupyterHub instance and members.
    """
    name = models.CharField(
        max_length=255,
        help_text="Name of the course"
    )
    description = models.TextField(
        blank=True,
        help_text="Course description"
    )
    jupyterhub_url = models.URLField(
        help_text="URL of the JupyterHub instance for this course"
    )
    owner = models.ForeignKey(
        CustomUserModel,
        on_delete=models.CASCADE,
        related_name='owned_courses',
        help_text="Course owner/administrator"
    )
    members = models.ManyToManyField(
        CustomUserModel,
        through='CourseMembership',
        related_name='enrolled_courses'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['created_at']),
            models.Index(fields=['owner']),
        ]
        ordering = ['-created_at']
        unique_together = ['name', 'owner']  # Prevent duplicate course names per owner

    def __str__(self):
        return f"{self.name} (by {self.owner.get_full_name()})"

    def get_active_members(self):
        """Returns all active members of the course"""
        return self.members.filter(course_memberships__is_active=True)


class Workspace(models.Model):
    """
    Represents a workspace within a course that can be shared among course members.
    """
    name = models.CharField(
        max_length=255,
        help_text="Name of the workspace"
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='workspaces'
    )
    workspace_url = models.URLField(
        help_text="URL to access this workspace in JupyterHub"
    )
    members = models.ManyToManyField(
        CustomUserModel,
        related_name='accessible_workspaces',
        help_text="Users who have access to this workspace"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['course']),
            models.Index(fields=['is_active']),
        ]
        ordering = ['name']
        unique_together = ['name', 'course']

    def __str__(self):
        return f"{self.name} - {self.course.name}"

    def get_absolute_url(self):
        return self.workspace_url

    def clean(self):
        if self.course and self.workspace_url:
            if not self.workspace_url.startswith(self.course.jupyterhub_url):
                raise ValidationError({
                    'workspace_url': _('Workspace URL must be a sub-path of the course JupyterHub URL')
                })
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class CourseMembership(models.Model):
    """
    Represents a user's membership in a course, including their role and workspace.
    """
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('ta', 'Teaching Assistant'),
    )
    
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE,
        related_name='memberships'
    )
    user = models.ForeignKey(
        CustomUserModel, 
        on_delete=models.CASCADE,
        related_name='course_memberships'
    )
    role = models.CharField(
        max_length=10, 
        choices=ROLE_CHOICES,
        default='student'
    )
    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='member_workspaces',
        help_text="User's primary workspace in this course"
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['course', 'user']
        indexes = [
            models.Index(fields=['role']),
            models.Index(fields=['joined_at']),
            models.Index(fields=['is_active']),
        ]
        ordering = ['-joined_at']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.course.name} ({self.role})"

    def get_workspace_url(self):
        """Returns the URL of the user's workspace if it exists"""
        return self.workspace.workspace_url if self.workspace else None

    @property
    def is_teacher(self):
        return self.role == 'teacher'

    @property
    def is_ta(self):
        return self.role == 'ta'

    @property
    def is_student(self):
        return self.role == 'student'
