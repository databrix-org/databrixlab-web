# Generated by Django 5.1.1 on 2024-11-12 09:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('LabManagement', '0003_lesson_lesson_type'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name='customusermodel',
            name='LabManageme_first_n_aee87c_idx',
        ),
        migrations.AddIndex(
            model_name='customusermodel',
            index=models.Index(fields=['first_name', 'last_name', 'is_instructor', 'is_student', 'is_staff'], name='LabManageme_first_n_690aad_idx'),
        ),
    ]
