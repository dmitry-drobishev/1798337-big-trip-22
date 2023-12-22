import { createElement } from '../render.js';
import { DATE_FORMAT, humanizeTaskDueDate, TIME_FORMAT } from '../utils';
import dayjs from 'dayjs';

function createPoint (point, destinations, offers) {

  const { basePrice, dateFrom, dateTo, isFavorite, type } = point;

  const pointDestination = destinations.find((destination) => destination.id === point.destination);
  const {name} = pointDestination;

  const pointOffersType = offers.find((offer) => offer.type === point.type).offers;
  const pointOffersChoose = pointOffersType.filter((offer) => point.offers.includes(offer.id));

  const convertedDataStartDay = humanizeTaskDueDate(dateFrom, DATE_FORMAT);
  const convertedDateFrom = humanizeTaskDueDate(dateFrom, TIME_FORMAT);
  const convertedDateTo = humanizeTaskDueDate(dateTo, TIME_FORMAT);
  const durationDate = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));
  const convertedDurationData = `${durationDate.days() > 1 ? `${durationDate.days()}D` : ''} ${durationDate.hours()}H ${durationDate.minutes()}M`;

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn--active'
    : '';

  return `<div class="event">

    <time class="event__date" datetime="">${convertedDataStartDay}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>

    <h3 class="event__title"> ${type} ${name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dateFrom}">${convertedDateFrom}</time>
        &mdash;
        <time class="event__end-time" datetime="${dateTo}">${convertedDateTo}</time>
      </p>
      <p class="event__duration">${convertedDurationData}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${pointOffersChoose.map((offer) => (
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
  )).join('')}

    </ul>
    <button class="event__favorite-btn ${favoriteClassName}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>`;
}

export default class Point {

  constructor(point, destinations, offers) {
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return createPoint(this.point, this.destinations, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
