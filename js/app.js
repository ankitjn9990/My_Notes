let notesContainer = document.getElementById('notes-container-area');
let form = document.querySelector('.form');
let noteHeader = document.getElementById('note-header');
let noteDescription = document.getElementById('note-description');
let submitButton = document.querySelector('.submit-button');
let preview = document.getElementById('preview');
let search = document.getElementById('search');
let notesArray = [];

function getData() {
    return fetch("./data/api.json").then(data => data.json());
}

initializeNotesArray();

function initializeNotesArray() {
    getData()
        .then((resp) => {
            resp.forEach(elem => notesArray.push(elem));
            // generateNoteList(notesArray);
            sortNotes();
        })
}

function checkInput() {
    if (noteHeader.value.trim() !== '' && noteDescription.value.trim() !== '') {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = 'rgb(36,235,36)';
    } else {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = 'grey';
    }
}

function generateNoteList(list) {
    notesContainer.innerHTML = list.map((elem, index) => createNote(elem, index)).join('');
}

function createNote(note, index) {
    let id = index + 1;
    return `
    <div onclick="previewNote(${index})" class="note-card">
        <div class="main-note-header">
            <div class="note-id">${id}</div>
            <div class="note-card-header">${note.header}</div>
            <button class="delete-note-button" onclick="deleteNote(${index})">Delete</button>
        </div>
        <hr>
        <div class="note-card-desc">${note.desc}</div>
    </div>
    `
}

function previewNote(index) {
    preview.innerHTML = notesArray[index].desc;
    resetActive(index);
}

function resetActive(index) {
    for (let i = 0; i < notesContainer.children.length; i++) {
        notesContainer.children[i].classList.remove('active');
    }
    notesContainer.children[index].classList.add('active');
    // notesContainer.children[index].classList.toggle("active");
}

function sortNotes() {
    if (notesArray.length < 1) return;

    var select = document.getElementById('sortBy');
    var option = select.options[select.selectedIndex];
    notesArray.sort(function (a, b) {
        if (a[option.value] < b[option.value]) { return -1; }
        if (a[option.value] > b[option.value]) { return 1; }
        return 0;
    });
    generateNoteList(notesArray);
}

function deleteNote(index) {
    notesArray.splice(index, 1);
    generateNoteList(notesArray);
}

function resetForm() {
    form.reset();
    checkInput();
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    notesArray.push({ header: noteHeader.value, desc: noteDescription.value });
    generateNoteList(notesArray);
    resetForm();
});

//Searching

let searchOperation = debounce(searchResult, 400);

search.addEventListener('input', searchOperation);

function debounce(fn, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => fn(), delay);
    }
}

function searchResult() {
    let filteredResult = notesArray.filter(note => {
        return note.header.toString().toLowerCase().indexOf(search.value.toLowerCase()) > -1 || note.desc.toString().toLowerCase().indexOf(search.value.toLowerCase()) > -1;
    });

    if (filteredResult.length > 0) {
        generateNoteList(filteredResult)
    }
}