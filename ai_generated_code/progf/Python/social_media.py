from flask import Blueprint, request, jsonify
from some_social_media_library import SocialMediaAPI
## REMEMBER TO CHECK THE SOCIALMEDIA PY FILE Built with basic GitHub coding tools.   ##
## YOU STILL NEED TO REGISTER YOUR APP TO GET THE SOCIAL MEDIA APIS ##
social_media = Blueprint('social_media', __name__)

api = SocialMediaAPI('api_key')

@social_media.route('/upload', methods=['POST'])
def upload_content():
    content = request.json.get('content')
    response = api.upload_content(content)
    return jsonify(response)