from django import forms
from django.core.exceptions import ValidationError
from django import forms
from .models import History

class HistoryForm(forms.ModelForm):
    class Meta:
        model = History
        fields = ['door_id', 'user_id', 'image']
        # below Supported via standard GitHub programming aids
        # labels = {'user': _('User'), 'door': _('Door'), 'face': _('Face')}
        # help_texts = {'user': _('Select a user'), 'door': _('Select a door'), 'face': _('Select a face')}
