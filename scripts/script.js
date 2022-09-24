const buttons = {
    closeBtns : document.querySelectorAll('.close-btn'),
    deleteBtn : document.querySelector('.delete-btn'),
    saveBtn : document.getElementById('subm-chng-btn'),
}

const forms = {
    addBookForm : document.getElementById('add-book-form'),
    bookStatusForm : document.getElementById('book-status-form'),
}

const popups = {
    addBookPopup : document.querySelector('.add-book-popup'),
    bookInfoPopup : document.querySelector('.book-info-popup'),
}

const overlay = document.querySelector('.overlay');
const body = document.body;
const bookFrame = document.querySelector('.book-frame');

buttons.closeBtns.forEach(closeBtn => {
    closeBtn.addEventListener('click', closePopup);
})

function closePopup(e){
    e.path[1].classList.add('hide');
    overlay.classList.add('hide');
    

    buttons.saveBtn.classList.add('hide');
}

forms.addBookForm.addEventListener('submit', getBookData);

function getBookData(e){
    e.preventDefault();

    const bTitle = this['title'].value;
    const bAuthor = this['author'].value;
    const bPages = this['pages'].value;
    let bPic = this['picture'].value;
    const bStatus = this['status'].value;

    if (bPic != '') bPic = URL.createObjectURL(this['picture'].files[0]);

    let book = new Book(bTitle, bAuthor, bPages, bPic, bStatus);
    bCollection.push(book);
    this.reset();

    createBook(bTitle, bPic, bStatus);

    popups.addBookPopup.classList.add('hide');
    overlay.classList.add('hide');
    
}

function createBook(bTitle, bPic, bStatus){
    const img = document.createElement('img');

    if (bPic == "") {
        img.setAttribute('src', 'img/no-cover.jpg');
        img.setAttribute('alt', bTitle);
    } else {
        img.setAttribute('src', bPic);
        img.setAttribute('alt', bTitle);
    }

    const book = document.createElement('button');
    book.setAttribute('title', bTitle);
    book.classList.add('book');

    if (bStatus == 'Read') book.classList.add('read');
    else if (bStatus == 'In Progress') book.classList.add('in-progress');
    else if (bStatus == 'Not Read') book.classList.add('not-read');

    book.addEventListener('click', displayBookInfo);

    bookFrame.appendChild(book);
    book.appendChild(img);

    displayBookOrNot();

    console.log(bCollection);
}

function displayBookInfo(e){
    popups.bookInfoPopup.classList.remove('hide');
    overlay.classList.remove('hide');
    

    for (const book of bCollection){
        if (book.bTitle != this.title){
            continue;
        } else {
            const titleLabel = popups.bookInfoPopup.children['book-title'];
            const authorLabel = popups.bookInfoPopup.children['book-author'];
            const pagesLabel = popups.bookInfoPopup.children['book-pages'];
            const statusList = popups.bookInfoPopup.children['book-status-form']['status'];

            titleLabel.textContent = `${book.bTitle}`;
            authorLabel.textContent = `By ${book.bAuthor}`;

            if (book.bPages <= 1) pagesLabel.textContent = `${book.bPages} page in total`;
            else pagesLabel.textContent = `${book.bPages} pages in total`;

            statusList.value = book.bStatus;

            statusList.addEventListener('change', displaySaveBtn);

            forms.bookStatusForm.addEventListener('submit', submNewBookStat);

            buttons.deleteBtn.addEventListener('click', deleteBook);
        }
    }
}

function displaySaveBtn(e){
    buttons.saveBtn.classList.remove('hide');
}

function submNewBookStat(e){
    e.preventDefault();

    const titleVal = popups.bookInfoPopup.children['book-title'].textContent;
    const statusVal = this['status'].value;

    for (const book of bCollection){
        if (book.bTitle != titleVal){
            continue;
        } else {
            book.bStatus = statusVal;
            popups.bookInfoPopup.children['book-status-form']['status'].value = statusVal;

            if (statusVal == 'Read') {
                for (const elem of bookFrame.children){
                    if (elem.title != titleVal){
                        continue;
                    } else {
                        elem.classList.remove('in-progress');
                        elem.classList.remove('not-read');
                    }
                }
            } else if (statusVal == 'In Progress') {
                for (const elem of bookFrame.children){
                    if (elem.title != titleVal){
                        continue;
                    } else {
                        elem.classList.add('in-progress');
                        elem.classList.remove('not-read');
                    }
                }
            } else if (statusVal == 'Not Read') {
                for (const elem of bookFrame.children){
                    if (elem.title != titleVal){
                        continue;
                    } else {
                        elem.classList.remove('in-progress');
                        elem.classList.add('not-read');
                    }
                }
            } 

            buttons.saveBtn.classList.add('hide');

            popups.bookInfoPopup.classList.add('hide');
            overlay.classList.add('hide');
            
        }
    }
}

function deleteBook(e){
    e.preventDefault();

    popups.bookInfoPopup.classList.add('hide');
    overlay.classList.add('hide');
    

    const titleLabel = popups.bookInfoPopup.children['book-title'];

    for (const book of bCollection){
        if (book.bTitle != titleLabel.textContent){
            continue;
        } else {
            for (let i = 0; i < bookFrame.children.length; i++){
                if (bookFrame.children[i].title != book.bTitle) continue; 
                else {
                    bookFrame.children[i].remove();

                    const bIndex = bCollection.findIndex(book => {
                        return book.bTitle == titleLabel.textContent;
                    });
                    bCollection.splice(bIndex, 1);

                    displayBookOrNot();

                    console.log(bCollection);
                }
            }
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