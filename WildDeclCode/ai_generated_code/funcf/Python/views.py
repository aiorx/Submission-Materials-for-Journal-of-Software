def delete_user(request):
    ## Aided with basic GitHub coding tools, not tested yet
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user = User.objects.get(pk=user_id)
        user.delete()
        return render(request, 'cms/delete_user.html', locals())
    else:
        list_user = User.objects.all()
    return render(request, 'cms/delete_user.html', locals())