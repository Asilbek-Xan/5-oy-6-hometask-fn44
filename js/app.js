import { elAddButton, elContainer, elEditButton, elForm, elLoader, elTemplateCard } from "./html-selection.js";
import { toast } from "./toast.js";

let editedElId = null;
let carsData = [];
let currentPage = 1;
const itemsPerPage = 6;
const paginationContainer = document.getElementById("pagination");

function renderPagination() {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(carsData.length / itemsPerPage);

  const prevBtn = document.createElement("button");
  prevBtn.innerText = "<";
  prevBtn.className = "btn btn-sm";
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener("click", () => { if(currentPage>1){ currentPage--; ui(carsData); } });
  paginationContainer.appendChild(prevBtn);

  const maxVisiblePages = 10;
  let startPage = 1;
  let endPage = Math.min(totalPages, maxVisiblePages);

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.innerText = i;
    pageBtn.className = "btn btn-sm";
    if (i === currentPage) pageBtn.classList.add("border-2","border-red-500","text-white");
    pageBtn.addEventListener("click", () => { currentPage=i; ui(carsData); });
    paginationContainer.appendChild(pageBtn);
  }

  if(totalPages > maxVisiblePages) {
    const dots = document.createElement("span");
    dots.innerText = "...";
    dots.className = "px-2";
    paginationContainer.appendChild(dots);

    const lastPage = document.createElement("button");
    lastPage.innerText = totalPages;
    lastPage.className = "btn btn-sm";
    lastPage.addEventListener("click", () => { currentPage=totalPages; ui(carsData); });
    paginationContainer.appendChild(lastPage);
  }

  const nextBtn = document.createElement("button");
  nextBtn.innerText = ">";
  nextBtn.className = "btn btn-sm";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener("click", () => { if(currentPage<totalPages){ currentPage++; ui(carsData); } });
  paginationContainer.appendChild(nextBtn);
}

function ui(cars) {
  elContainer.innerHTML = "";
  const startIndex = (currentPage-1)*itemsPerPage;
  const endIndex = startIndex+itemsPerPage;
  const paginatedCars = cars.slice(startIndex,endIndex);

  paginatedCars.forEach(element => {
    const clone = elTemplateCard.cloneNode(true).content;
    const elTitle = clone.querySelector("h2");
    const elDescription = clone.querySelector("p");
    const elDeleteButton = clone.querySelector(".js-delete");
    const elEditButton = clone.querySelector(".js-edit");

    elTitle.innerText = element.name;
    elDescription.innerText = element.description;
    elDeleteButton.id = element.id;
    elEditButton.id = element.id;

    elContainer.appendChild(clone);
  });

  renderPagination();
}

function init() {
  elLoader.style.display = "block";
  fetch("https://json-api.uz/api/project/fn44/cars")
    .then(res=>res.json())
    .then(res=>{ carsData=res.data; currentPage=1; ui(carsData); })
    .catch(()=>alert("Xatolik bo'ldi ⚠️"))
    .finally(()=>elLoader.style.display="none");
}

function deleteCar(id) {
  fetch(`https://json-api.uz/api/project/fn44/cars${id}`,{method:'DELETE'})
  .then(res=>{if(!res.ok)throw new Error("Server xatosi");return res.text();})
  .then(()=>{toast("Mashina o'chirildi ✅");init();});
}

function addCar(car) {
  fetch(`https://json-api.uz/api/project/fn44/cars`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(car)})
  .then(res=>res.json()).then(()=>init());
}

function editCar(car) {
  fetch(`https://json-api.uz/api/project/fn44/cars${car.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(car)})
  .then(()=>{ editedElId=null; elAddButton.style.display="block"; elEditButton.style.display="none"; elForm.reset(); init(); })
  .catch(()=>alert("Xatolik bo'ldi ⚠️"))
  .finally(()=>elLoader.style.display="none");
}

init();

elForm.addEventListener("submit",e=>{
  e.preventDefault();
  const formData=new FormData(elForm);
  const result={};
  formData.forEach((v,k)=>result[k]=v);
  if(e.submitter.id==="addButton") addCar(result);
  else { result.id=editedElId; editCar(result); }
});

elContainer.addEventListener("click",e=>{
  if(e.target.classList.contains("js-delete")){ if(confirm("Qo'lingiz tegib ketmadimi, yoki Rostdan ham o'chirmoqchimisiz?")){ e.target.innerText="Loading . . ."; deleteCar(e.target.id); } }
  if(e.target.classList.contains("js-edit")){ e.target.innerHTML="Loading . . ."; editedElId=e.target.id; elAddButton.style.display="none"; elEditButton.style.display="block";
    fetch(`https://json-api.uz/api/project/fn44/cars${e.target.id}`)
    .then(res=>res.json())
    .then(res=>{ elForm.name.value=res.name; elForm.description.value=res.description; })
    .catch(()=>alert("Xatolik bo'ldi ⚠️"))
    .finally(()=>{ e.target.innerText="Tahrirlash"; });
  }
});
