import './styles.css';
import fetchCountries from './fetchCountries.js';
import countryListItemsTemplate from './tamplate/countryListItem.hbs';
import countriesListTemplate from './tamplate/countrieList.hbs';
import PNotify from 'pnotify/dist/es/PNotify.js';
import debounce from 'lodash.debounce';

const countryList = document.querySelector('#country-list');
const searchInput = document.querySelector('.search__input');

searchInput.addEventListener('submit', event => {
  event.preventDefault();
});

searchInput.addEventListener(
  'input',
  debounce(e => {
    searchFormInputHandler(e);
  }, 500),
);

function searchFormInputHandler(e) {
  const searchQuery = e.target.value;

  clearListItems();

  fetchCountries(searchQuery).then(data => {
    if (!data) {
      return;
    } else if (data.length > 10) {
      PNotify.error({
        title: 'Извините',
        text: 'Слишком много совпадений, уточните запрос',
      });
    } else if (data.length >= 2 && data.length <= 10) {
      const renderCountriesList = buildCountriesList(data);
      insertListItem(renderCountriesList);
    } else if (data.length === 1) {
      const markup = buildListItemMarkup(data);
      insertListItem(markup);
    } else {
      alert('Ничего не найдено.Корректно введите запрос');
    }
  });
}

function insertListItem(items) {
  countryList.insertAdjacentHTML('beforeend', items);
}

function buildCountriesList(items) {
  return countriesListTemplate(items);
}

function buildListItemMarkup(items) {
  return countryListItemsTemplate(items);
}

function clearListItems() {
  countryList.innerHTML = '';
}
