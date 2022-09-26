const overlay = document.getElementById('overlay');

function toggleTabIndex(){
    const books = document.querySelectorAll('.book');
    books.forEach(book => {

        if (book.getAttribute('tabindex') === 0 || 
        book.getAttribute('tabindex') === null){

            book.setAttribute('tabindex', -1);
        }
        else {
            book.setAttribute('tabindex', 0);
        }
    });

    const links = document.querySelectorAll('a');
    links.forEach(link => {

        if (link.getAttribute('tabindex') === 0 || 
        link.getAttribute('tabindex') === null){

            link.setAttribute('tabindex', -1);
        }
        else {
            link.setAttribute('tabindex', 0);
        }
    });
}


const toggle = (() => {
    class Toggle{

        addBookModal(){
            const addBookModal = document.getElementById('add-book-modal');
            addBookModal.classList.toggle('active');
            overlay.classList.toggle('active');

            toggleTabIndex();
        }
    }

    return new Toggle();
})();

function closeModal(e){
    e.path[1].classList.toggle('active');
    overlay.classList.toggle('active');
    toggleTabIndex();
};

const buttons = (() => {

    const addBookButton = document.getElementById('add-book-btn');
    addBookButton.addEventListener('click', toggle.addBookModal);

    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(button => {
            button.addEventListener('click', closeModal);
        });
})();

const book = (() => {
    class Book{
        constructor(){
            this.collection = [];
        }
        create(bTitle, bAuthor, bPages, bPic, bStatus){
            return {
                bTitle,
                bAuthor,
                bPages,
                bPic,
                bStatus,
            }
        }
        getData(e){
            e.preventDefault();

            const bTitle = addBookForm['title'].value;
            const bAuthor = addBookForm['author'].value;
            const bPages = addBookForm['pages'].value;
            let bPic = addBookForm['picture'].value;
            const bStatus = addBookForm['status'].value;

            if (bPic != '') bPic = URL.createObjectURL(addBookForm['picture'].files[0]);

            let newBook = book.create(bTitle, bAuthor, bPages, bPic, bStatus);
            book.collection.push(newBook);
            addBookForm.reset();
        
            book.displayInDOM(bTitle, bPic, bStatus);
        
            toggle.addBookModal();
            overlay.classList.remove('active');
        }
        displayInDOM(bTitle, bPic, bStatus){
            const img = document.createElement('img');

            if (bPic == "") {
                img.setAttribute('src', 'img/no-cover.jpg');
                img.setAttribute('alt', bTitle);
            } else {
                img.setAttribute('src', bPic);
                img.setAttribute('alt', bTitle);
            }
        
            const newBook = document.createElement('div');
            newBook.setAttribute('title', bTitle);
            newBook.classList.add('book');
        
            if (bStatus == 'Read') newBook.classList.add('read');
            else if (bStatus == 'In Progress') newBook.classList.add('in-progress');
            else if (bStatus == 'Not Read') newBook.classList.add('not-read');
        
            newBook.addEventListener('click', displayBookInfo);
            newBook.appendChild(img);

            const bookRack = document.querySelector('.book-rack');
            const addBookButton = document.getElementById('add-book-btn');
            bookRack.insertBefore(newBook, addBookButton);
        
            console.log(book.collection);
        }
    }

    return new Book();
})();

const addBookForm = document.getElementById('add-book-form');
addBookForm.addEventListener('submit', book.getData);

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