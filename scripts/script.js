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

        addBookModal(e){
            const addBookModal = document.getElementById('add-book-modal');
            addBookModal.classList.toggle('active');
            overlay.classList.toggle('active');

            toggleTabIndex();
        }
        bookInfoModal(e){
            const bookInfoModal = e.target.children[1];
            if (bookInfoModal == undefined) return 0;
            
            bookInfoModal.classList.add('active');
            overlay.classList.add('active');
            
            toggleTabIndex();
        }
    }

    return new Toggle();
})();

function closeModal(e){
    e.path[1].classList.toggle('active');
    overlay.classList.toggle('active');

    toggleTabIndex();

    if (e.path[1].children[4].children[1].children[1] != undefined){
        const saveChangeButton = e.path[1].children[4].children[1].children[1];
        saveChangeButton.classList.remove('active');
    }
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
        
            toggle.addBookModal();
            book.displayInDOM(bTitle, bPic, bStatus);
            book.createInfo(bTitle, bAuthor, bPages, bStatus);
        
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
            newBook.setAttribute('tabindex', 0);
            newBook.classList.add('book');
        
            if (bStatus == 'Read') newBook.classList.add('read');
            else if (bStatus == 'In Progress') newBook.classList.add('in-progress');
            else if (bStatus == 'Not Read') newBook.classList.add('not-read');
        
            newBook.appendChild(img);

            const bookRack = document.querySelector('.book-rack');
            const addBookButton = document.getElementById('add-book-btn');
            bookRack.insertBefore(newBook, addBookButton);
        
            console.log(book.collection);
        }
        createInfo(bTitle, bAuthor, bPages, bStatus){
            const bookInfoModal = document.querySelector('.book-info');
            const newBookInfo = bookInfoModal.cloneNode(true);
            newBookInfo.setAttribute('id', bTitle);

            const bookTitleElem = newBookInfo.children[0];
            bookTitleElem.textContent = bTitle;

            const bookAuthorElem = newBookInfo.children[2];
            bookAuthorElem.textContent = `By ${bAuthor}`;

            const bookPagesElem = newBookInfo.children[3];
            if (bookPagesElem.textContent <= 1) bookPagesElem.textContent = `${bPages} page in total`;
            else bookPagesElem.textContent = `${bPages} pages in total`

            const bookStatusElem = newBookInfo.children[4].children[0].children[0];
            bookStatusElem.value = bStatus;

            bookStatusElem.addEventListener('change', () => {
                const saveChangeButton = document.querySelector(`.book > #${bTitle} > .book-status-form > .btn-frame > .submit-change-btn`);
                saveChangeButton.classList.add('active');
            })

            const bookRack = document.querySelector('.book-rack');
            for (const book of bookRack.children){
                if (book.getAttribute('title') !== bTitle){
                    continue;
                }
                else{
                    book.appendChild(newBookInfo);
                    book.addEventListener('click', toggle.bookInfoModal);

                    const closeButtons = document.querySelectorAll('.close-btn');
                    closeButtons.forEach(button => {
                            button.addEventListener('click', closeModal);
                    })

                    const bookStatusForm = newBookInfo.children[4];
                    const deleteBookButton = newBookInfo.children[4][1];

                    deleteBookButton.addEventListener('click', deleteBook);
                    bookStatusForm.addEventListener('submit', saveChange);
                }
            }
        }
    }

    return new Book();
})();

const addBookForm = document.getElementById('add-book-form');
addBookForm.addEventListener('submit', book.getData);

function saveChange(e){
    e.preventDefault();
    const bTitle = e.path[1].getAttribute('id');
    const newBookStatus = e.target[0].value;

    const bookRack = document.querySelector('.book-rack');
    for (const book of bookRack.children){
        if(book.getAttribute('title') != bTitle){
            continue;
        }
        else {
            e.target[0].value = newBookStatus;
            if (newBookStatus === 'Read'){
                book.classList.remove('in-progress');
                book.classList.remove('not-read');
            }
            else if (newBookStatus === 'In Progress'){
                book.classList.add('in-progress');
                book.classList.remove('not-read');
            }
            else {
                book.classList.add('not-read');
                book.classList.remove('in-progress');
            }
        }
    }

    for (let index = 0; index < book.collection.length; index++){
        if (book.collection[index].bTitle != bTitle){
            continue;
        }
        else {
            book.collection[index].bStatus = newBookStatus;
        }
    }

    e.target[2].classList.remove('active');
    e.path[1].classList.remove('active');
    overlay.classList.remove('active');
}

function deleteBook(e){
    e.preventDefault();

    const bTitle = e.path[4].getAttribute('title');
    console.log(bTitle)
    const bookRack = document.querySelector('.book-rack');
    
    e.path[1].classList.remove('active');
    overlay.classList.remove('active');

    for (const book of bookRack.children){
        if (book.getAttribute('title') !== bTitle){
            continue;
        }
        else {
            book.remove();
        }
    }
    
    for (let index = 0; index < book.collection.length; index++){
        if (book.collection[index].bTitle !== bTitle){
            continue;
        }
        else {
            book.collection.splice(index, 1);
        }
    }
}