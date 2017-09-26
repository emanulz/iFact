from django.db import models
import os
from uuid import uuid4
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


def path_and_rename(path):
    def wrapper(instance, filename):
        ext = filename.split('.')[-1]
        # get filename
        if instance.pk:
            filename = '{}.{}'.format(instance.pk, ext)
        else:
            # set filename as random string
            filename = '{}.{}'.format(uuid4().hex, ext)
        # return the whole path to the file
        return os.path.join(path, filename)
    return wrapper


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to=path_and_rename('avatars'), blank=True)
    location = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
