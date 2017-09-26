# -*- coding: utf-8 -*-

from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.core import serializers


@login_required
def profile_get(request):

    user = request.user
    profile = request.user.profile

    data = serializers.serialize('json', [user, profile])

    if request.method == 'GET':
        return HttpResponse(data, content_type='application/json')
