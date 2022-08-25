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

    const saveBtn = popups.bookInfoPopup.children['change-book-info']['subm-chng-btn'];
    saveBtn.classList.add('hide');
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

    bBtn.addEventListener('click', displayBookInfo);

    bookFrame.appendChild(bBtn);
    bBtn.appendChild(bCover);
    displayBookOrNot();

    console.log(bCollection);
}

function displayBookInfo(e){
    popups.bookInfoPopup.classList.remove('hide');
    overlay.classList.remove('hide');
    body.style.cssText = 'background-color: var(--grey);';

    for (const book of bCollection){
        if (book.bTitle != e.target.title){
            continue;
        } else {
            const bTitle = popups.bookInfoPopup.children['book-title'];
            const bAuthor = popups.bookInfoPopup.children['book-author'];
            const bPages = popups.bookInfoPopup.children['book-pages'];
            const bStatus = popups.bookInfoPopup.children['change-book-info']['status'];

            bTitle.textContent = `${book.bTitle}`;
            bAuthor.textContent = `By ${book.bAuthor}`;
            if (book.bPages <= 1) bPages.textContent = `${book.bPages} page in total`;
            else bPages.textContent = `${book.bPages} pages in total`;
            bStatus.value = book.bStatus;

            bStatus.addEventListener('change', changeStatus);

            const delBookBtn = popups.bookInfoPopup.children['change-book-info']['delete-book-btn'];
            delBookBtn.addEventListener('click', deleteBook);

            forms.changeBookInfoForm.addEventListener('submit', submitNewBookInfo);
        }
    }
}

function changeStatus(e){
    const saveBtn = popups.bookInfoPopup.children['change-book-info']['subm-chng-btn'];
    saveBtn.classList.remove('hide');
}

function submitNewBookInfo(e){
    e.preventDefault();

    const bTitle = popups.bookInfoPopup.children['book-title'].textContent;
    const bStatus = this['status'].value;

    for (const book of bCollection){
        if (book.bTitle != bTitle){
            continue;
        } else {
            book.bStatus = bStatus;
            popups.bookInfoPopup.children['change-book-info']['status'].value = bStatus;

            if (bStatus == 'Read') {
                for (const elem of bookFrame.children){
                    if (elem.title != bTitle){
                        continue;
                    } else {
                        elem.classList.remove('in-progress');
                        elem.classList.remove('not-read');
                    }
                }
            } else if (bStatus == 'In Progress') {
                for (const elem of bookFrame.children){
                    if (elem.title != bTitle){
                        continue;
                    } else {
                        elem.classList.add('in-progress');
                        elem.classList.remove('not-read');
                    }
                }
            } else if (bStatus == 'Not Read') {
                for (const elem of bookFrame.children){
                    if (elem.title != bTitle){
                        continue;
                    } else {
                        elem.classList.remove('in-progress');
                        elem.classList.add('not-read');
                    }
                }
            } 

            const saveBtn = popups.bookInfoPopup.children['change-book-info']['subm-chng-btn'];
            saveBtn.classList.add('hide');

            popups.bookInfoPopup.classList.add('hide');
            overlay.classList.add('hide');
            body.style.cssText = 'background-color: none;';
        }
    }
}

function deleteBook(e){
    e.preventDefault();

    popups.bookInfoPopup.classList.add('hide');
    overlay.classList.add('hide');
    body.style.cssText = 'background-color: none;';

    const bTitle = popups.bookInfoPopup.children['book-title'];
    for (const book of bCollection){
        if (book.bTitle != bTitle.textContent){
            continue;
        } else {
            for(let i = 0; i < bookFrame.children.length; i++){
                if (bookFrame.children[i].title != book.bTitle){
                    continue;
                }
                else{
                    bookFrame.children[i].remove();
                    const bIndex = bCollection.findIndex(book => {
                        return book.bTitle == bTitle.textContent;
                    });
                    bCollection.splice(bIndex, 1);

                    displayBookOrNot();
                    
                    console.log(bCollection);
                }
            }
        }
    }
}

function displayBookOrNot(){
    if (bookFrame.children.length <= 2) {
        popups.noBookPopup.classList.remove('hide');
        bookFrame.classList.remove('display-book');
    } else {
        popups.noBookPopup.classList.add('hide');
        bookFrame.classList.add('display-book');
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