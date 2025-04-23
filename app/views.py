import os
from flask import Blueprint, request, jsonify, render_template, current_app
from werkzeug.utils import secure_filename
from .tasks import perform_ocr

main = Blueprint('main', __name__)

@main.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@main.route('/ocr', methods=['POST'])
def ocr_endpoint():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.root_path, filename)
    file.save(filepath)

    task = perform_ocr.delay(filepath)

    return jsonify({'task_id': task.id}), 202

@main.route('/result/<task_id>')
def task_result(task_id):
    task = perform_ocr.AsyncResult(task_id)
    if task.state == 'PENDING':
        response = {
            'state': task.state,
            'status': 'Pending...'
        }
    elif task.state != 'FAILURE':
        response = {
            'state': task.state,
            'result': task.result
        }
    else:
        # something went wrong in the background job
        response = {
            'state': task.state,
            'status': str(task.info),  # this is the exception raised
        }
    return jsonify(response)