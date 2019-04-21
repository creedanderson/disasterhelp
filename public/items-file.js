
// this page is for the javascript for the items the people put in that they need to buy

console.log('hello world items-file.js');


const itemsTable = document.getElementById('items_table');
const itemsForm = document.getElementById('items-form');
const itemDescription = itemsForm.elements[0];
const itemDescription1 = itemsForm.elements[1];
const itemDescription2 = itemsForm.elements[2];

var items= []
  
const appendNewItem = function(itemRow) {
  console.log('in appendNewItem. item is ' || itemRow);
  /*
  const newListItem3 = document.createElement('tr');
  const nameTD = document.createElement('td');
  newListItem3.innerHTML = itemRow.item_name;
  itemsTable.appendChild(newListItem3);
  */
  //var tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];

  // Insert a row in the table at the last row
  var newRow   = itemsTable.insertRow(itemsTable.rows.length);
  
  // Insert a cell in the row at index 0
  var newCell  = newRow.insertCell(0);
  var newText  = document.createTextNode(itemRow.item_name);
  newCell.appendChild(newText);
  
  var newCell1  = newRow.insertCell(1);
  var newText5  = document.createTextNode(itemRow.url)
  newCell1.appendChild(newText5);
  
  var newCell2 = newRow.insertCell(2);
  var newText1  = document.createTextNode(itemRow.quantity);
  newCell2.appendChild(newText1);
 
  var newCell4  = newRow.insertCell(3);
  var newText4  = document.createTextNode(itemRow.date_bought);
  newCell4.appendChild(newText4);
  
  var newCell5  = newRow.insertCell(4);
  var newText5  = document.createTextNode(itemRow.username);
  newCell5.appendChild(newText5);
     
  var newCell6  = newRow.insertCell(5);
  var newButton  = document.createElement("button");
  newButton.setAttribute('id', itemRow.item_id);
  newButton.setAttribute('onclick', 'bought(this)');
  newCell6.appendChild(newButton);
 
}

function bought(that){
  var itemId = that.id;
  //alert("bought button clicked for item id " + itemId);
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", '/bought');
  var hiddenField = document.createElement("input");
  hiddenField.setAttribute("type", "hidden");
  hiddenField.setAttribute("name", "itemId");
  hiddenField.setAttribute("value", itemId);
  form.appendChild(hiddenField);
  document.body.appendChild(form);
  form.submit();
}

const getItemsListener = function() {
    console.log('begin getItemsListener');
  // parse our response to convert to JSON
    // parse our response to convert to JSON
  items = JSON.parse(this.responseText);

  // iterate through every dream and add it to our page
  items.forEach( function(row) {
    appendNewItem(row);
  });
}

const itemRequest = new XMLHttpRequest();
itemRequest.onload = getItemsListener;
itemRequest.open('get', '/getitems');
itemRequest.send()


