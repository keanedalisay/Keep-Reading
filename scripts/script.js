const buttons = {
    addBookBtn : document.querySelector('.add-book-button'),
    closeBtns : document.querySelectorAll('.close-button'),
    deleteBtn : document.querySelector('.delete-button'),
}

const forms = {
    addBookForm : document.getElementById('add-book'),
    changeBookInfoForm : document.getElementById('change-book-info'),
}

const popups = {
    noBookPopup : document.querySelector('.no-book-popup'),
    addBookPopup : document.querySelector('.add-book-popup'),
    bookInfoPopup : document.querySelector('.book-info-popup'),
}

const overlay = document.querySelector('.overlay');
const body = document.body;
buttons.addBookBtn.addEventListener('click', openAddBookPopup);

function openAddBookPopup(e){
    popups.addBookPopup.classList.remove('hide');
    overlay.classList.remove('hide');
    body.style.cssText = 'background-color: var(--grey);';
}

buttons.closeBtns.forEach(closeBtn => {
    closeBtn.addEventListener('click', closePopup);
})

function closePopup(e){
    e.path[1].classList.add('hide');
    overlay.classList.add('hide');
    body.style.cssText = 'background-color: none;';
}

const bookFrame = document.querySelector('.book-frame');
forms.addBookForm.addEventListener('submit', getBookData);

function getBookData(e){
    e.preventDefault();

    const bTitle = this['title'].value;
    const bAuthor = this['author'].value;
    const bPages = this['pages'].value;
    let bPic = this['picture'].value;

    if (bPic == '') bPic = this['picture'].value;
    else bPic = URL.createObjectURL(this['picture'].files[0]);

    const bStatus = this['status'].value;

    let book = new Book(bTitle, bAuthor, bPages, bPic, bStatus);
    bCollection.push(book);
    this.reset();

    createBook(bTitle, bPic, bStatus);

    popups.addBookPopup.classList.add('hide');
    overlay.classList.add('hide');
    body.style.cssText = 'background-color: none;';
}

function createBook(bTitle, bPic, bStatus){
    const bCover = document.createElement('img');

    if (bPic == "") {
        bCover.setAttribute('src', 'img/no-cover.jpg');
        bCover.setAttribute('alt', bTitle);
    } else {
        bCover.setAttribute('src', bPic);
        bCover.setAttribute('alt', bTitle);
    }

    const bBtn = document.createElement('button');
    bBtn.setAttribute('title', bTitle);
    bBtn.classList.add('book');

    if (bStatus == 'Read') bBtn.classList.add('read');
    else if (bStatus == 'In Progress') bBtn.classList.add('in-progress');
    else if (bStatus == 'Not Read') bBtn.classList.add('not-read');

    bookFrame.appendChild(bBtn);
    displayBookOr(bBtn);
    bBtn.appendChild(bCover);
}

function displayBookOr(book){
    for (const elem of bookFrame.children){
        if (elem != book) {
            popups.noBookPopup.classList.remove('hide');
            bookFrame.classList.remove('display-book');
        } else {
            popups.noBookPopup.classList.add('hide');
            bookFrame.classList.add('display-book');
        }
    }
}

function Book (bTitle, bAuthor, bPages, bPic, bStatus){
    this.bTitle = bTitle;
    this.bAuthor = bAuthor;
    this.bPages = bPages;
    this.bPic = bPic;
    this.bStatus = bStatus;
}

const bCollection = [];