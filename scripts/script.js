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