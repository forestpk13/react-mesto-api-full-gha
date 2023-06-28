class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  _getData(path) {
    return fetch(`${this._baseUrl}${path}`, {
      credentials: 'include',
    })
      .then(this._checkResponse);
  }

  _changeData(data, path) {
    return fetch(`${this._baseUrl}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    })
      .then(this._checkResponse);
  }

  _handleLike(method, id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: method,
      credentials: 'include',
    })
      .then(this._checkResponse);
  }

  changeLikeCardStatus(id, isLiked) {
    return isLiked ? this._handleLike('DELETE', id) : this._handleLike('PUT', id);
  }

  setLike(id) {
    return this._handleLike('PUT', id);
  }

  deleteLike(id) {
    return this._handleLike('DELETE', id);
  }

  getInitialCards() {
    return this._getData('/cards');
  }

  getProfileData() {
    return this._getData('/users/me');
  }

  setProfileData(data) {
    return this._changeData(data, '/users/me');
  }

  setProfileAvatar(avatar) {
    return this._changeData(avatar, '/users/me/avatar');
  }

  addCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    })
    .then(res => this._checkResponse(res));
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    .then(res => this._checkResponse(res))
  }

}

export const api = new Api({
  baseUrl: 'http://api.forestpk13.nomoreparties.sbs',
});