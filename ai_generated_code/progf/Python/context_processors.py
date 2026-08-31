# code Written with routine coding tools4
# explanation is that I  need  the dict pending_requests_count to be
# available in any html  template and I can do this by registering
# this procesor in settings.py  
from .models import Booking

def pending_requests_count(request):
    if request.user.is_authenticated:
        count = Booking.objects.filter(property__owner=request.user, status='pending').count()
        return {'pending_requests_count': count}
    return {}


from django.db.models import Q
def your_next_escapes_count(request):
    if request.user.is_authenticated:
        bookings = Booking.objects.filter(Q(property__owner=request.user) | Q(my_property__owner=request.user), status='accepted').order_by('-date_from')
        count = bookings.count()
        return {'your_next_escapes_count': count}
    return {}