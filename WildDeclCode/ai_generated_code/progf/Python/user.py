from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Poll, Choice, Vote
from django.contrib import messages
from django.db import IntegrityError
from datetime import date

#the user dashboard main function
@login_required
def dashboard(request):
    #get all of the user polls
    polls = Poll.objects.filter(created_by_id=request.user.id).order_by('id')

    today = date.today()

    #loop on them to generate the link and save it as a variable
    for poll in polls:
        poll.shareable_link = poll.generate_link(request)

        if poll.deadline and poll.deadline.date() < today and poll.active:
            poll.active = not poll.active
            poll.save()
            messages.info(request, f"Poll with id '{poll.id}' was automatically deactivated due to deadline.")

    #create the context data that will be sent
    context = {
        "username": request.user.username,
        "polls": polls
    }
    return render(request, "dashboard.html", context)

#to create a new poll
@login_required
def create_poll(request):
    #checks if the request is post
    if request.method=="POST":

        #gets the question of the poll
        question = request.POST.get("question")

        #gets a list of the choices
        choices = request.POST.getlist("choices")

        deadline = request.POST.get("deadline")

        if deadline:

            #create the poll object and use the create method to save directly to the database
            poll = Poll.objects.create(
                question=question,
                created_by=request.user,
                deadline=deadline,
            )

        else:
            #create the poll object and use the create method to save directly to the database
            poll = Poll.objects.create(
                question=question,
                created_by=request.user,
            )

        #loop on the list that got for the choices
        for choice in choices:
            #create the choice object and save it to the database too
            new_choice = Choice.objects.create(
                poll=poll,
                choice_text=choice,
            )

        #redirect again to the dashboard with a success message
        messages.success(request, "Poll added successfully!")
        return redirect("dashboard")
    
    #if the request wasn't post then redirect to the create poll page with the username
    context = {
        "username": request.user.username,
    }
    return render(request, "create_poll.html", context)

#show all of the poll details
@login_required
def poll_details(request):
    #gets the poll id
    poll_id = request.GET.get("poll_id")

    #create an object of that poll id
    poll = Poll.objects.get(id=poll_id)

    #create a choice object of all of the choices on the db
    choices = Choice.objects.filter(poll_id=poll_id)

    # Prepare data for Chart.js
    choice_texts = []

    for choice in choices:
        choice_texts.append(choice.choice_text)

    vote_counts = []

    for choice in choices:
        vote_counts.append(choice.votes)


    #create the data that will be sent to the template
    context = {
        "username": request.user.username,
        "poll": poll,
        "choices":choices,
        "choice_texts":choice_texts,
        "vote_counts":vote_counts,
    }
    return render(request, "poll_details.html", context)

# a function Aided with basic GitHub coding tools to get the client ip address to be saved with the poll so a user don't spam on a poll
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

# vote to a poll
def vote_to_poll(request):
    
    #gets the poll id
    poll_id = request.GET.get("poll_id")

    today = date.today()

    #create an object of the poll with that poll_id
    poll = Poll.objects.get(id=poll_id)

    if (poll.deadline and poll.deadline.date() < today and poll.active) or not poll.active:
            poll.active = not poll.active
            poll.save()
            messages.warning(request, f"This poll is inactive now!.")

            return render(request,"vote_submit.html")

    #create an object of the choices with that poll_id
    choices = Choice.objects.filter(poll_id=poll_id)

    #get the users ip address
    ip_address = get_client_ip(request)

    # Create a unique identifier for this user+poll combination
    vote_key = f"voted_on_poll_{poll_id}"
    
    #if the request is a post request
    if request.method == "POST":
        # Check if user has already voted using session
        print(request.session)
        if vote_key in request.session:
            messages.error(request, "You have already voted on this poll.")
            return render(request,"vote_submit.html")
            
        #gets the users choice_id
        selected_choice_id = request.POST.get("selected_choice")

        #creates an object with that id of the users choice
        selected_choice = Choice.objects.get(id=selected_choice_id)

        #increase the number of choices by 1
        selected_choice.votes += 1

        try:
            # Save both session indicator
            request.session[vote_key] = True
            # Vote.objects.create(poll=poll, ip_address=ip_address)
            
            #saves the new number of choices
            selected_choice.save()
            #send a success message for the user
            messages.success(request, "Your vote has been recorded!")
        except IntegrityError:
            messages.error(request, "You have already voted on this poll.")

        #return a blank page to show the message
        return render(request,"vote_submit.html")
    
    #if the user is with a get request he will render the html page with the poll context
    context = {
        "poll": poll,
        "choices":choices
    }
    return render(request, "vote_to_poll.html", context)

@login_required
def update_poll(request, poll_id):

    poll = Poll.objects.get(id = poll_id)

    #checks if the request is post
    if request.method=="POST":

        #gets the question of the poll
        question = request.POST.get("question")

        #gets a list of the choices
        choices = request.POST.getlist("choices")

        deadline = request.POST.get("deadline")

        #create the poll object and use the create method to save directly to the database
        poll.question = question
        if deadline:
            poll.deadline = deadline
        else:
            poll.deadline = None
        poll.save()

        old_choices = Choice.objects.filter(poll=poll)

        # Create a set of existing choice texts for comparison
        old_choice_texts = set(old_choices.values_list('choice_text', flat=True))

        # Create a set of new choice texts from the form
        new_choice_texts = set(choices)

        # Determine which choices to delete
        choices_to_delete = old_choice_texts - new_choice_texts

        # Determine which choices to add
        choices_to_add = new_choice_texts - old_choice_texts

        # Delete the removed choices
        Choice.objects.filter(poll=poll, choice_text__in=choices_to_delete).delete()

        # Add the new choices
        for choice_text in choices_to_add:
            Choice.objects.create(poll=poll, choice_text=choice_text)

        # Redirect to the dashboard with a success message
        messages.success(request, "Poll updated successfully!")
        return redirect("dashboard")

    # If the request wasn't POST, then redirect to the update poll page with the poll data
    context = {
        "username": request.user.username,
        "poll": poll,
        "choices": Choice.objects.filter(poll=poll)
    }
    return render(request, "update_poll.html", context)

@login_required
def delete_poll(request, poll_id):
    
    # `poll = get_object_or_404(Poll, id=poll_id, created_by= request.user)` is a line of code that
    # retrieves a specific `Poll` object from the database based on the provided `poll_id` and
    # `created_by` fields.
    poll = get_object_or_404(Poll, id=poll_id, created_by= request.user)

    if request.method == 'POST':
        poll.delete()
        messages.success(request, "Poll Delete successfully!")
        return redirect("dashboard")
    else:
        messages.error(request, "Method not allowed!")
        return redirect("dashboard")

@login_required
def deactivate_poll(request, poll_id):
    poll = get_object_or_404(Poll, id=poll_id, created_by=request.user)

    if request.method == 'POST':
        today = date.today()
        # Check if trying to activate an expired poll
        if not poll.active and poll.deadline and poll.deadline.date() < today:
            messages.error(request, "Cannot activate expired poll!")
            return redirect("dashboard")
            
        poll.active = not poll.active
        poll.save()
        status = "activated" if poll.active else "deactivated"
        messages.success(request, f"Poll {status} successfully!")
        return redirect("dashboard")
    else:
        messages.error(request, "Method not allowed!")
        return redirect("dashboard")