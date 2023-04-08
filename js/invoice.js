const services = [
  {
    id: 1,
    title: "Domain Service",
    price: 15,
  },
  {
    id: 2,
    title: "Hosting Service",
    price: 30,
  },
  {
    id: 3,
    title: "Web Design Service",
    price: 150,
  },
  {
    id: 4,
    title: "Maintenance Service",
    price: 100,
  },
];

const invoiceForm = document.querySelector("#invoiceForm");
const selectService = document.querySelector("#selectService");
const quantity = document.querySelector("#quantity");
const lists = document.querySelector("#lists");
const subTotal = document.querySelector("#subTotal");
const tax = document.querySelector("#tax");
const total = document.querySelector("#total");
const listsTable = document.querySelector("#lists-table");
const openServiceModal = document.querySelector("#openServiceModal");
// const serviceModal = document.querySelector("#serviceModal");
const closeServiceModal = document.querySelector("#closeServiceModal");
const addServiceInfo = document.querySelector("#addServiceInfo");
const menu = document.querySelectorAll(".menu");
const sidebar = document.querySelector("#sidebar");
const serviceModal = new bootstrap.Modal("#serviceModal");
// const app = document.querySelector("#app");

//loop services and show in select form
services.forEach((service) => {
  selectService.append(new Option(service.title, service.id));
});

const createTr = (service, quantity) => {
  const tr = document.createElement("tr");
  tr.classList.add("list");
  tr.setAttribute("service-id", service.id);
  const total = service.price * quantity;
  tr.innerHTML = `
  <td class="d-flex justify-content-between">
    ${service.title}
    <i class="bi bi-trash text-danger del-btn"></i>
  </td>
  <td class="text-end list-quantity">${quantity}</td>
  <td class="text-end">${service.price}</td>
  <td class="text-end service-total">${total}</td>
 `;
  return tr;
};

const findTax = (totalAmount, percentage = 5) => {
  return totalAmount * (percentage / 100);
};

const findTotal = () => {
  // let subTotal = 0; //important let not const because of change value
  // serviceTotal.forEach((el) => (subTotal += parseFloat(el.innerText)));
  // let serviceTotal = [...document.querySelectorAll(".service-total")].reduce(
  //   (pv, cv) => pv + parseFloat(cv.innerText),
  //   0
  // );
  const serviceTotal = [...document.querySelectorAll(".service-total")].reduce(
    (pv, cv) => pv + parseFloat(cv.innerText),
    0
  );
  subTotal.innerText = serviceTotal;
  tax.innerText = findTax(serviceTotal);
  total.innerText = serviceTotal + findTax(serviceTotal);
};

//show table
const showTable = () => {
  if (lists.children.length) {
    listsTable.classList.remove("d-none");
  } else {
    listsTable.classList.add("d-none");
  }
};

//form submit
invoiceForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedServices = services.find(
    (service) => service.id == selectService.value
  );

  const isExistedService = [...lists.children].find(
    (el) => el.getAttribute("service-id") == selectedServices.id
  );

  if (isExistedService) {
    const existedQuantity = isExistedService.querySelector(".list-quantity");
    existedQuantity.innerText =
      parseFloat(existedQuantity.innerText) + quantity.valueAsNumber;

    let selectedTotal = isExistedService.querySelector(".service-total");
    selectedTotal.innerText =
      parseFloat(existedQuantity.innerText) * selectedServices.price;
  } else {
    lists.append(createTr(selectedServices, quantity.valueAsNumber));
  }

  findTotal();
  invoiceForm.reset();
  showTable();
});

//delete
app.addEventListener("click", (event) => {
  const currentElement = event.target;
  if (currentElement.classList.contains("del-btn")) {
    currentElement.closest("tr").remove();
  }
  findTotal();
  showTable();
});

openServiceModal.addEventListener("click", () => {
  // serviceModal.classList.remove("d-none");
  serviceModal.show();
});

closeServiceModal.addEventListener("click", () => {
  // serviceModal.classList.add("d-none");
  serviceModal.hide();
});

addServiceForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // event.target သူက အဲ့ form ကိုပြန်ထုတ်ပေးတယ်
  const formData = new FormData(event.target);
  console.log(formData.get("serviceTitle"), formData.get("servicePrice"));

  //add new service to services
  const id = Date.now();
  services.push({
    id,
    title: formData.get("serviceTitle"),
    price: formData.get("servicePrice"),
  });

  //update services array
  selectService.append(new Option(formData.get("serviceTitle"), id));

  //form reset
  addServiceForm.reset();

  //close modal
  // serviceModal.classList.add("d-none");
  serviceModal.hide();
});

menu.forEach((el) => {
  el.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
});
