import $ from 'jquery';
import './index.css'
import shoppingList from './scripts/shopping-list';

const main = function () {
  shoppingList.bindEventListeners();
  shoppingList.render();
};

$(main);
