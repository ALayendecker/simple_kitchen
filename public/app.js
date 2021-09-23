const actionBtn = document.getElementById('action-button');
// new item
const makeNote = document.getElementById('make-new');
// clear all items
// const clear = document.getElementById('clear-all');
// delete an item
const results = document.getElementById('results');

const status = document.getElementById('status');

function getResults() {
  clearTodos();
  fetch('/all')
    .then(function (response) {
      if (response.status !== 200) {
        console.log(
          'Looks like there was a problem. Status Code: ' + response.status
        );
        return;
      }
      response.json().then(function (data) {
        newTodoSnippet(data);
      });
    })
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
}

function newTodoSnippet(res) {
  for (var i = 0; i < res.length; i++) {
    let data_id = res[i]['_id'];
    let title = res[i]['title'];
    let quantity = res[i]['item'];
    console.log(quantity);
    let todoList = document.getElementById('results');
    snippet = `
      <p class="data-entry">
      <span><h3  class="dataTitle" data-id=${data_id}>${title} ${quantity}x <span onClick="delete" class="delete" data-id=${data_id}>Delete</span></h3></span>
      </p>`;
    todoList.insertAdjacentHTML('beforeend', snippet);
  }
}

function clearTodos() {
  const todoList = document.getElementById('results');
  todoList.innerHTML = '';
}

function resetTitleAndNote() {
  const item = document.getElementById('item');
  item.value = '';
  const title = document.getElementById('title');
  title.value = '';
}

function updateTitleAndNote(data) {
  const item = document.getElementById('item');
  item.value = data.item;
  const title = document.getElementById('title');
  title.value = data.title;
}

getResults();

// clear.addEventListener('click', function (e) {
//   if (e.target.matches('#clear-all')) {
//     element = e.target;
//     data_id = element.getAttribute('data-id');
//     fetch('/clearall', {
//       method: 'delete',
//     })
//       .then(function (response) {
//         if (response.status !== 200) {
//           console.log(
//             'Looks like there was a problem. Status Code: ' + response.status
//           );
//           return;
//         }
//         clearTodos();
//       })
//       .catch(function (err) {
//         console.log('Fetch Error :-S', err);
//       });
//   }
// });

results.addEventListener('click', function (e) {
  if (e.target.matches('.delete')) {
    element = e.target;
    data_id = element.getAttribute('data-id');
    fetch('/delete/' + data_id, {
      method: 'delete',
    })
      .then(function (response) {
        if (response.status !== 200) {
          console.log(
            'Looks like there was a problem. Status Code: ' + response.status
          );
          return;
        }
        element.parentNode.remove();
        resetTitleAndNote();
        let newButton = `
      <button id='make-new'>Submit</button>`;
        actionBtn.innerHTML = newButton;
      })
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });
  } else if (e.target.matches('.dataTitle')) {
    element = e.target;
    data_id = element.getAttribute('data-id');
    status.innerText = 'Editing';
    fetch('/find/' + data_id, { method: 'get' })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        updateTitleAndNote(data);
        let newButton = `<button id='updater' data-id=${data_id}>Update</button>`;
        actionBtn.innerHTML = newButton;
      })
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });
  }
});

actionBtn.addEventListener('click', function (e) {
  if (e.target.matches('#updater')) {
    updateBtnEl = e.target;
    data_id = updateBtnEl.getAttribute('data-id');
    const title = document.getElementById('title').value;
    const item = document.getElementById('item').value;
    fetch('/update/' + data_id, {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        item,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        element.innerText = title;
        resetTitleAndNote();
        let newButton = `<button id='make-new'>Submit</button>`;
        actionBtn.innerHTML = newButton;
        status.innerText = 'Creating';
      })
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });
  } else if (e.target.matches('#make-new')) {
    element = e.target;
    data_id = element.getAttribute('data-id');
    fetch('/submit', {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: document.getElementById('title').value,
        item: document.getElementById('item').value,
        created: Date.now(),
      }),
    })
      .then((res) => res.json())
      .then((res) => newTodoSnippet([res]));
    resetTitleAndNote();
  }
});
