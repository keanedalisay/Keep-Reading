const buttons = {
    addBookBtn : document.querySelector('.add-book-button'),
    subAddBookBtn : document.querySelector('.add-book'),
    subChangeBookInfoBtn : document.querySelector('.change-book-info'),
    closeBtns : document.querySelectorAll('.close-button'),
    deleteBtn : document.querySelector('.delete-button'),
}

const popups = {
    noBookPopup : document.querySelector('.no-book-popup'),
    addBookPopup : document.querySelector('.add-book-popup'),
    bookInfoPopup : document.querySelector('.book-info-popup'),
}

const body = document.body;
buttons.addBookBtn.addEventListener('click', openAddBookPopup);

function openAddBookPopup(e){
    popups.addBookPopup.classList.remove('hide');
    body.classList.add('overlay');
}