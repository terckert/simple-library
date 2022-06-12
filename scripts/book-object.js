// Page object constants
const libraryBody = document.getElementById('library-table-body')
const modalContainer = document.getElementById('modal-container')
const modalTitle = document.getElementById('item-form-title')
const modalSaveEditBtn = document.getElementById('form-save-edit-btn')
const formAddEdit = document.forms['item-form']
const siteInstructions = document.getElementById('instructions')

// Library declarations
let myLibrary = []

// Sort booleans. Tracks what attribute the library is current sorted by. Starts
// all false as there is no current sort. Adding a new item restores these values
// false to account for the new object being added to the list.
let titleSort = false
let authorSort = false
let pagesSort = false
let readSort = false



/**
 * @name  Book
 * 
 * @param {string}  title   Title of the book
 * @param {string}  author  Author of the book 
 * @param {int}     pages   Number of pages
 * @param {boolean} read    Has the book been read?
 * 
 * @summary Book object constructor.
 */
function Book(title, author, pages, read)
{
    this.Title  = title
    this.Author = author
    this.Pages  = pages
    this.Read   = read  
}

Book.prototype.Info = function () {
    return `${this.Title} by ${this.Author}, ${this.Pages} pages, ${(this.Read) ? 'read' : 'not yet read' }`
}

/**
 * @name  addBookToLibrary
 * 
 * @param {Book} newBook 
 * 
 * @summary Adds a book to the library.
 */
function addBookToLibrary(newBook)
{
    myLibrary.push(newBook)
    console.log('Adding ' + newBook.Info() + ' to library')
    titleSort = authorSort = pagesSort = readSort = false
}

/**
 * @function removeBookFromLibrary
 * 
 * @param {int} index 
 * @summary Removes the requested index from the book library and redraws the table.
 */
function removeBookFromLibrary(rowNo)
{
    const index = parseInt(rowNo)
    let lastInd = myLibrary.length - 1 // Last index of library
    // Out of bounds checking
    if (index > lastInd) {
        console.log("Index is out of range.")
    }
    // If it's the last index, pop it like it's hot
    else if (index == lastInd)
    {
        myLibrary.pop()
    }
    // Otherwise concatenate what comes before and what comes after the
    // removed index to preserve ordering.
    else if (index != lastInd)
    {   
        myLibrary = myLibrary
            .slice(0, index)
            .concat(myLibrary.slice(index+1))
    }
    deleteLibraryBody()
    drawLibraryBody()
}

// Test books
// addBookToLibrary(new Book('The Hobbit', 'J.R.R. Tolkien', 295, true))
// addBookToLibrary(new Book('Assassinorum: Kingmaker', 'Robert Rath', 359, false))
// addBookToLibrary(new Book('Bible', 'God', 4000, false))

/**
 * @name drawLibraryBody
 * @summary Loops through myLibrary and draws the book table. If library 
 */
function drawLibraryBody()
{
    let lastInd = myLibrary.length
    if (lastInd > 0){
        siteInstructions.style.display = 'none'
        for (let i = 0; i < lastInd; i++) {        
            // Add new table row to library table
            libraryBody.append(createNewRow(myLibrary[i], i))
        }
    }
    else
        siteInstructions.style.display = 'block'

}

function createNewRow(book, rowNo) {
    // let newRow = document.createElement('tr')
    let newRow = document.createElement('tr')
    newRow.classList.add('book-row') 
    newRow.id = 'book-row'    
        
    // Creating the title column
    let childEle = document.createElement('td')
    childEle.innerText = book.Title
    newRow.appendChild(childEle);
    
    // Creating the author column
    childEle = document.createElement('td')
    childEle.innerText = book.Author
    newRow.appendChild(childEle);
    
    // Creating the pages column
    childEle = document.createElement('td')
    childEle.classList.add('center-text')
    childEle.innerText = book.Pages
    newRow.appendChild(childEle);

    // Creating the read column
    childEle = document.createElement('td')
    childEle.classList.add('center-text')
    childEle.innerText = (book.Read) ? 'Read' : 'Unread'
    newRow.appendChild(childEle);

    // Create the edit row
    childEle = document.createElement('td')
    childEle.classList.add('center-text')
    childEle.innerHTML = `<button value=${rowNo} onclick=\"showAddEdit('edit', this.value)\">&#128221;</button>`
    newRow.appendChild(childEle)

    // Create the remove row
    childEle = document.createElement('td')
    childEle.classList.add('center-text')
    childEle.innerHTML = `<button value=${rowNo} onclick='removeBookFromLibrary(this.value)'>&#10060;</button>`
    newRow.append(childEle)

    return newRow
}

/**
 * @name deleteLibraryTable
 * @summary Deletes the all library rows except the header row. Used to reset the
 *          table.
 */
function deleteLibraryBody() {
    Array.from(document.getElementsByClassName('book-row'))
        .forEach(row => libraryBody.removeChild(row))
}

/**
 * @name sortLibrary
 * @param {string} column   Column corresponds to Book property
 * @summary  Sorts the library based on column clicked. If already sorted by the column, reverses the list. 
 */
function sortLibrary(column) {
    if (column == 'Title'){
        if (titleSort) {
            myLibrary.reverse()
        }
        else {
            titleSort = authorSort = pagesSort = readSort = false
            titleSort = true
            myLibrary.sort( function (lhs, rhs) {
                let lcmp = lhs['Title'].toLowerCase()
                let rcmp = rhs['Title'].toLowerCase()
                if (lcmp > rcmp) return 1
                if (lcmp < rcmp) return -1
                return 0
            });
        }
    }
    else if (column == 'Author') {
        if (authorSort) {
            myLibrary.reverse()
        }
        else {
            titleSort = authorSort = pagesSort = readSort = false
            authorSort = true
            myLibrary.sort( function (lhs, rhs) {
                let lcmp = lhs['Author'].toLowerCase()
                let rcmp = rhs['Author'].toLowerCase()
                if (lcmp > rcmp) return 1
                if (lcmp < rcmp) return -1
                return 0
            });
        }
    }
    else if (column == 'Pages') {
        if (pagesSort) {
            myLibrary.reverse()
        }
        else {
            titleSort = authorSort = pagesSort = readSort = false
            pagesSort = true
            myLibrary.sort( function (lhs, rhs) {
                return lhs['Pages'] - rhs['Pages']
            });
        }
    }
    else {
        if (readSort) {
            myLibrary.reverse()
        }
        else {
            titleSort = authorSort = pagesSort = readSort = false
            readSort = true
            myLibrary.sort( function (lhs, rhs) {
                if (lhs['Read'] > rhs['Read']) return 1
                if (lhs['Read'] < rhs['Read']) return -1
                return 0
            });
        }
    }

    deleteLibraryBody()
    drawLibraryBody()
}

function closeAddEdit() {
    console.log("Close button hit")
    modalContainer.classList.remove('show-modal')
    modalSaveEditBtn.removeAttribute('onclick')
}

function showAddEdit(type, row=-1) {
    console.log(`Array index: ${row}`)
    console.log("Hit the " + type + ' button')
    if(type == 'add') {
        modalTitle.innerText = 'Add new book'           // Set popup title
        modalSaveEditBtn.innerText = 'Save'             // Set button text
        modalSaveEditBtn.setAttribute('onclick', `userAddBook()`)
        //modalSaveEditBtn.addEventListener('click', userAddBook) // Set onclick event

        // Set default values
        formAddEdit['Title'].value = ''
        formAddEdit['Author'].value = ''
        formAddEdit['Pages'].value = ''
        formAddEdit['Read'].value = 'false'
    }
    else if(type == 'edit') {
        modalTitle.innerText = 'Edit book'           // Set popup title
        modalSaveEditBtn.innerText = 'Edit'          // Set button text
        modalSaveEditBtn.setAttribute('onclick', `userEditBook(${row})`)

        // Set default values
        formAddEdit['Title'].value  = myLibrary[row].Title
        formAddEdit['Author'].value = myLibrary[row].Author
        formAddEdit['Pages'].value  = myLibrary[row].Pages
        formAddEdit['Read'].value   = (myLibrary[row].Read) ? 'true' : 'false'
    }
    modalContainer.classList.add('show-modal')
}

function userAddBook() {
    closeAddEdit()
    const newBook = new Book(       // Create the new book
        formAddEdit['Title'].value,
        formAddEdit['Author'].value,
        parseInt(formAddEdit['Pages'].value),
        (formAddEdit['Read'].value == 'true') ? true : false
    )

    libraryBody.append(createNewRow(newBook, myLibrary.length)) // Append to table
    addBookToLibrary(newBook)
    siteInstructions.style.display = 'none'
}

function userEditBook(rowNo) {
    closeAddEdit()
    const newBook = new Book(
        formAddEdit['Title'].value,
        formAddEdit['Author'].value,
        parseInt(formAddEdit['Pages'].value),
        (formAddEdit['Read'].value == 'true') ? true : false
    )
    titleSort = authorSort = pagesSort = readSort = false
    myLibrary[rowNo] = newBook
    deleteLibraryBody()
    drawLibraryBody()
}
