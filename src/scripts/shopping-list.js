import store from './store.js';
import item from './item.js';

const generateItemElement = function (item) {
  let itemTitle = `<span class='shopping-item shopping-item__checked'>${item.name}</span>`;
  if (!item.checked) {
    itemTitle = `
     <span class='shopping-item'>${item.name}</span>
    `;
  }
  if (item.toEdit) {
    itemTitle = `
    <input type="text" class="newName" value="${item.name}">
    <button class="button-label js-confirm-edit">click to confirm</button>`
  }

  return `
    <li class='js-item-element' data-item-id='${item.id}'>
      ${itemTitle}
      <div class='shopping-item-controls'>
        <button class='shopping-item-toggle js-item-toggle'>
          <span class='button-label'>check</span>
        </button>
        <button class='shopping-item-delete js-item-delete'>
          <span class='button-label'>delete</span>
        </button>
        <button class='shopping-item-edit js-item-edit'>
          <span class='button-label'>edit</span>
        </button>
      </div>
    </li>`;
};

const generateShoppingItemsString = function (shoppingList) {
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join('');
};

const render = function () {
  // Filter item list if store prop is true by item.checked === false
  let items = [...store.items];
  if (store.hideCheckedItems) {
    items = items.filter(item => !item.checked);
  }

  // render the shopping list in the DOM
  const shoppingListItemsString = generateShoppingItemsString(items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
};

const handleNewItemSubmit = function () {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    store.addItem(newItemName);
    render();
  });
};

const handleItemCheckClicked = function () {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    store.findAndToggleChecked(id);
    render();
  });
};

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
};

const handleDeleteItemClicked = function () {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in store.items
    const id = getItemIdFromElement(event.currentTarget);
    // delete the item
    store.findAndDelete(id);
    // render the updated shopping list
    render();
  });
};

const handleEditItemClick = function () {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleToEdit(id);
    render();
  })
}

const toggleToEdit = (id) => {
  const index = store.items.findIndex(item => item.id === id);
  const found = store.items[index];
  found.toEdit = !found.toEdit;
}

const handleEditConfirmClick = () => {
  $('.js-shopping-list').on('click', '.js-confirm-edit', event => {
    const id = getItemIdFromElement(event.currentTarget);
    const newName = $(event.currentTarget).closest('li').find('.newName').val();
    editItemName(id, newName);
  })
}

const editItemName = (id, newName) => {
  const found = store.items.find(item => item.id === id);
  found.name = newName;
  found.toEdit = false;
  render();
}

const handleToggleFilterClick = function () {
  $('.js-filter-checked').click(() => {
    store.toggleCheckedFilter();
    render();
  });
};

const bindEventListeners = function () {
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleEditConfirmClick();
  handleEditItemClick();
  handleToggleFilterClick();
};

// This object contains the only exposed methods from this module:
export default {
  render,
  bindEventListeners
};