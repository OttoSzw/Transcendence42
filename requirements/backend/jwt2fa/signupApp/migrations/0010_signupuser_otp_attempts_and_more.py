# Generated by Django 4.2.19 on 2025-02-16 18:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('signupApp', '0009_alter_signupuser_is_2fa_enabled'),
    ]

    operations = [
        migrations.AddField(
            model_name='signupuser',
            name='otp_attempts',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='signupuser',
            name='is_2fa_enabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='signupuser',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
