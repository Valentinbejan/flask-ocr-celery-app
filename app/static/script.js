document.getElementById('uploadButton').addEventListener('click', function() {
    var fileInput = document.getElementById('imageUpload');
    var loadingDiv = document.getElementById('loading');
    var resultDiv = document.getElementById('result');
    var ocrTextsDiv = document.getElementById('ocrTexts');

    if (fileInput.files.length === 0) {
        alert('Please select at least one image file.');
        return;
    }

    ocrTextsDiv.innerHTML = ''; // Clear previous results

    loadingDiv.style.display = 'block';
    resultDiv.style.display = 'none';

    for (let i = 0; i < fileInput.files.length; i++) {
        let file = fileInput.files[i];
        let formData = new FormData();
        formData.append('image', file);

        let resultContainer = document.createElement('div');
        resultContainer.classList.add('result-container');
        resultContainer.id = `result-${i}`;

        // Add file name label to result container
        let fileNameLabel = document.createElement('p');
        fileNameLabel.classList.add('result-file-name');
        fileNameLabel.textContent = `File: ${file.name}`;
        resultContainer.appendChild(fileNameLabel);

        ocrTextsDiv.appendChild(resultContainer);

        fetch('/ocr', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            checkTaskStatus(data.task_id, `result-${i}`);
        })
        .catch(error => {
            console.error('Error:', error);
            loadingDiv.style.display = 'none';
            alert(`An error occurred while processing image ${i + 1}.`);
        });
    }
});

function checkTaskStatus(taskId, resultContainerId) {
    var loadingDiv = document.getElementById('loading');
    var resultDiv = document.getElementById('result');
    var resultContainer = document.getElementById(resultContainerId);

    fetch(`/result/${taskId}`)
    .then(response => response.json())
    .then(data => {
        if (data.state === 'SUCCESS') {
            // Create a container for the textarea and copy button
            let textAreaContainer = document.createElement('div');
            textAreaContainer.classList.add('text-area-container');

            let ocrText = document.createElement('textarea');
            ocrText.readOnly = true;
            ocrText.value = data.result;

            // Check if the result is the "No text found" message
            if (data.result === "No text found in the image.") {
                ocrText.value = data.result; // Display the message in the textarea
            }

            // Create a copy button
            let copyButton = document.createElement('button');
            copyButton.classList.add('copy-button');
            copyButton.textContent = 'Copy';
            copyButton.addEventListener('click', function() {
                navigator.clipboard.writeText(ocrText.value).then(() => {
                    // Optional: Display a success message or change the button text
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => copyButton.textContent = 'Copy', 1500); // Reset after 1.5 seconds
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });

            // Append the textarea and copy button to the container
            textAreaContainer.appendChild(ocrText);
            textAreaContainer.appendChild(copyButton);

            // Append the container to the result container
            resultContainer.appendChild(textAreaContainer);

            // Check if all tasks are finished
            if (document.querySelectorAll('#ocrTexts .text-area-container').length === document.getElementById('imageUpload').files.length) {
                loadingDiv.style.display = 'none';
                resultDiv.style.display = 'block';
            }
        } else if (data.state === 'PENDING') {
            // Retry after a delay
            setTimeout(() => checkTaskStatus(taskId, resultContainerId), 1000);
        } else {
            loadingDiv.style.display = 'none';
            alert('An error occurred while processing the image.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        loadingDiv.style.display = 'none';
        alert('An error occurred while processing the image.');
    });
}

document.getElementById('imageUpload').addEventListener('change', function() {
    var fileInput = document.getElementById('imageUpload');
    var imagePreviewsDiv = document.getElementById('imagePreviews');
    imagePreviewsDiv.innerHTML = ''; // Clear previous previews

    for (let i = 0; i < fileInput.files.length; i++) {
        let file = fileInput.files[i];
        let reader = new FileReader();

        reader.onload = function(e) {
            let previewContainer = document.createElement('div');
            previewContainer.classList.add('preview-container');

            let previewImg = document.createElement('img');
            previewImg.src = e.target.result;
            previewImg.classList.add('preview-image');
            previewContainer.appendChild(previewImg);

            let fileNameLabel = document.createElement('p');
            fileNameLabel.textContent = file.name;
            fileNameLabel.classList.add('file-name');
            previewContainer.appendChild(fileNameLabel);

            imagePreviewsDiv.appendChild(previewContainer);
        };

        reader.readAsDataURL(file);
    }
});