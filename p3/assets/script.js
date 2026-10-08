"use strict";

// Parte 1: use estes dados para criar workshopPrototype e suas instancias.
const workshopData = [
    { id: 1, title: "Objetos e prototipos", description: "Crie objetos reutilizaveis e compreenda a cadeia de prototipos.", level: "Intermediario", duration: 90, instructorId: 1 },
    { id: 2, title: "Classes modernas", description: "Modele entidades com class, extends e super.", level: "Intermediario", duration: 75, instructorId: 2 },
    { id: 3, title: "JavaScript no navegador", description: "Organize eventos e atualizacoes de uma interface.", level: "Iniciante", duration: 60, instructorId: 1 },
    { id: 4, title: "Arquitetura frontend", description: "Separe dados, dominio e renderizacao em uma aplicacao.", level: "Avancado", duration: 105, instructorId: 3 }
];

const instructorData = [
    { id: 1, name: "Ana Souza", specialty: "JavaScript" },
    { id: 2, name: "Bruno Lima", specialty: "Arquitetura" },
    { id: 3, name: "Carla Mendes", specialty: "Frontend" }
];

const toastPrototype = {
    show(message, type = "success") {
        const element = document.querySelector("[data-toast]");
        if (!element) return;
        const supportedTypes = ["success", "warning", "error"];
        const messageType = supportedTypes.includes(type) ? type : "success";
        element.textContent = message;
        element.className = `toast is-visible is-${messageType}`;
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => element.classList.remove("is-visible"), 3500);
    }
};

// Parte 1 - crie workshopPrototype, os workshops e as evidencias solicitadas.

const workshopPrototype = {
    getLabel(){
        return `${this.title} - ${this.level} - ${this.duration} minutos`; 
    },

    isAvailable(){
        return this.available; 
    }
}; 

const workshop1 = Object.create(workshopPrototype);
workshop1.title = "Objetos e prototipos"; 
workshop1.level = "Intermediário"; 
workshop1.duration = 90; 
workshop1.available = true; 

const workshop2 = Object.create(workshopPrototype);
workshop2.title = "Classes em JavaScript";
workshop2.level = "Intermediário"; 
workshop2.duration = 75; 
workshop2.available = false;

workshopPrototype.enroll = function(){
    if(this.available === false){
        return false; 
    }
    this.available = false; 
    return true; 
}

console.log(Object.getPrototypeOf(workshop1) === workshopPrototype);
console.log(Object.getPrototypeOf(workshop2) === workshopPrototype);
console.log(`level é próprio? ${Object.hasOwn(workshop1, "level")}`);
console.log(`getLabel é próprio? ${Object.hasOwn(workshop1, "getLabel")}`); 

console.log(`duration é próprio? ${Object.hasOwn(workshop2, "duration")}`); 
console.log(`isAvailable é prórpio? ${Object.hasOwn(workshop2, "isAvailable")}`); 

const schedule = {
    day: "Segunda-feira", 
    workshops: [
        {
            title: "Objetos e prototipos", 
            duration: 90
        }, 

        {
            title: "Classes em JavaScript", 
            duration: 75
        }, 
    ]
}; 
//Cópia rasa
const shallowCopy = {...schedule}; 

//Os objetos principais são diferentes 
console.log(shallowCopy !== schedule);

//A lista de workshops é a mesma
console.log(shallowCopy.workshops === schedule.workshops); 

//Alternanod um item dentro da cópia 
shallowCopy.workshops[0].title = "Titulo alternado"; 

//A alteração também aparece no objeto original
console.log(shallowCopy.workshops[0].title); 
console.log(schedule.workshops[0].title);

const deepCopy = structuredClone(schedule); 
console.log(deepCopy.workshops === schedule.workshops); 

deepCopy.workshops[0].title = "Título da copia profunda"; 

console.log(deepCopy.workshops[0].title); 
console.log(schedule.workshops[0].title); 

const schedulePrevent = Object.preventExtensions({
    name: "Segunda-feira", 
    workshops: [
         {
            title: "Objetos e prototipos - I", 
            duration: 90
        }, 

        {
            title: "Classes em JavaScript - II", 
            duration: 75
        }, 
    ]
}); 

const scheduleSeal = Object.seal({
    name: "Segunda-feira", 
    workshops: [
        {
            title: "Objetos e prototipos - I", 
            duration: 90
        },
        {
            title: "Classes em JavaScript - II", 
            duration: 75
        }
    ]
}); 

const scheduleFreeze = Object.freeze({
    name: "Segunda-feira", 
    workshops: [
        {
            title: "Objetos e prototipos - I", 
            duration: 90
        },
        {
            title: "Classes em JavaScript - II", 
            duration: 75
        }
    ]
}); 

schedulePrevent.workshops.title = "Nova lista"; //É permitido modificar
console.log(Reflect.deleteProperty(schedulePrevent, "name")); //É permitido deletar
schedulePrevent.workshops.endereco = "Rua horrivel"; //Não é permitido adicionar

scheduleSeal.workshops.title = "Aula tio fábio"; //É permitido modificar
console.log(Reflect.deleteProperty(scheduleSeal, "name")); // Não é permitido deletar
scheduleSeal.workshops.endereco = "LabCad"; //Não é permitido adicionar
    
scheduleFreeze.workshops.title = "Aula tio paulo"; // Não é permitido modificar 
console.log(Reflect.deleteProperty(scheduleFreeze, "name")); //Não é permitido deletar
scheduleFreeze.workshops.endereco = "LabInferno"; //Não é permitido adicionar 


// Parte 2 - implemente Instructor, Workshop e WorkshopCatalog.
// Os metodos devem ser definidos no protgotipo das instancias.

class Instructor {
    constructor(id, name, specialty) {
        this.id = id;
        this.name = name;
        this.specialty = specialty;
    }

    getLabel() {
        return `${this.name} - ${this.specialty}`;
    }
}

class Workshop {
    constructor(id, title, description, level, duration, instructor) {
        this.id = id;
        this.title = title;
        this.description = description; 
        this.level = level;
        this.duration = duration;
        this.instructor = instructor;
    }

    getSummary() {
        return `${this.duration} minutos - ${this.level} - ${this.instructor.getLabel()}`;
    }
}

class WorkshopCatalog {
    constructor(workshops) {
        this.workshops = workshops; 
    }

    list() {
        return this.workshops; 
    }

    findById(id) {
        return this.workshops.find(workshop => workshop.id === Number(id));
    }

    filterByTitle(term) {
        const searchTerm = term.toLowerCase().trim();

        return this.workshops.filter(workshop => workshop.title.toLowerCase().includes(searchTerm));
    }

    filterByInstructor(instructorId) {
        return this.workshops.filter(workshop => workshop.instructor.id === Number(instructorId));
    }
}

    //Criação das entidades
    const instructors = instructorData.map(data =>{
        return new Instructor(
            data.id, 
            data.name, 
            data.specialty
        )
    }); 

    const workshops = workshopData.map(data =>{
        const instructor = instructors.find(instructor => instructor.id === data.instructorId); 

        return new Workshop(
            data.id, 
            data.title, 
            data.description, 
            data.level, 
            data.duration, 
            instructor
        )
    }); 

    const catolog = new WorkshopCatalog(workshops);
    // 5. EVIDÊNCIAS    
console.log(instructors[0].getLabel());
console.log(instructors[1].getLabel());

console.log(instructors[0].getLabel === instructors[1].getLabel);

console.log(workshops[0].getSummary());
console.log(workshops[1].getSummary());

console.log(workshops[0].getSummary === workshops[1].getSummary);


const state = { instructors: [], workshops: [], selectedInstructorId: "", term: "" , catalog: null };
const instructorFilter = document.querySelector("#instructor-filter");
const workshopFilter = document.querySelector("#workshop-filter");
const catalogStatus = document.querySelector("#catalog-status");
const workshopList = document.querySelector("#workshop-list");
const workshopDetail = document.querySelector("#workshop-detail");
const toast = Object.create(toastPrototype);

function renderWorkshops() {
    catalogStatus.textContent = "Carregando oficinas...";
    workshopList.innerHTML = '<p class="empty">Carregando oficinas...</p>';

    let workshops = state.catalog.list();

    if (state.selectedInstructorId !== "") {
        workshops = state.catalog.filterByInstructor(state.selectedInstructorId);
    }

    if (state.term !== "") {
        workshops = workshops.filter(workshop =>
            state.catalog.filterByTitle(state.term).includes(workshop)
        );
    }

    if (workshops.length === 0) {
        catalogStatus.textContent = "Nenhuma oficina encontrada.";
        workshopList.innerHTML = `
            <p class="empty">
                Nenhuma oficina corresponde aos filtros informados.
            </p>
        `;
        toast.show("Nenhuma oficina corresponde aos filtros.", "warning");
        return;
    }

    workshopList.innerHTML = "";

    workshops.forEach(workshop => {
        const article = document.createElement("article");
        article.className = "workshop";

        article.innerHTML = `
            <div>
                <h3>${workshop.title}</h3>
                <p>${workshop.getSummary()}</p>
            </div>

            <button type="button" data-workshop-id="${workshop.id}">
                Ver ementa
            </button>
        `;

        workshopList.appendChild(article);
    });

    catalogStatus.textContent =
        `${workshops.length} oficina(s) encontrada(s).`;
}

function renderInstructors() {
    instructorFilter.innerHTML = '<option value="">Todos os instrutores</option>';

    state.instructors.forEach(instructor => {
        const option = document.createElement("option");
        option.value = instructor.id;
        option.textContent = instructor.getLabel();
        instructorFilter.appendChild(option);
    });
}

function showWorkshopDetail(workshopId) {
    const workshop = state.catalog.findById(workshopId);

    if (!workshop) {
        toast.show("Oficina não encontrada.", "error");
        return;
    }

    workshopDetail.innerHTML = `
        <div>
            <h3>${workshop.title}</h3>

            <p>${workshop.description}</p>

            <div class="detail-grid">
                <p>
                    <strong>Nível:</strong>
                    ${workshop.level}
                </p>

                <p>
                    <strong>Duração:</strong>
                    ${workshop.duration} minutos
                </p>

                <p>
                    <strong>Instrutor:</strong>
                    ${workshop.instructor.getLabel()}
                </p>
            </div>
        </div>
    `;

    toast.show("Ementa carregada.", "success");
}

function validateWorkshopId(id) {
    const workshop = state.catalog.findById(id);

    if (!workshop) {
        catalogStatus.textContent = "Erro: oficina não encontrada.";
        workshopList.innerHTML = `
            <p class="empty">
                Não foi possível encontrar a oficina informada.
            </p>
        `;

        toast.show("Erro ao consultar a oficina.", "error");

        return false;
    }

    catalogStatus.textContent = "Consulta realizada com sucesso.";
    toast.show("Oficina encontrada.", "success");

    return true;
}

function initialize() {
    state.instructors = instructorData.map(data => {
        return new Instructor(
            data.id,
            data.name,
            data.specialty
        );
    });

    state.workshops = workshopData.map(data => {
        const instructor = state.instructors.find(
            item => item.id === data.instructorId
        );

        return new Workshop(
            data.id,
            data.title,
            data.description,
            data.level,
            data.duration,
            instructor
        );
    });

    state.catalog = new WorkshopCatalog(state.workshops);

    renderInstructors();
    renderWorkshops();
    toast.show("Catálogo carregado com sucesso.", "success");
}

instructorFilter.addEventListener("change", () => {
    state.selectedInstructorId = instructorFilter.value;
    renderWorkshops();
});

workshopFilter.addEventListener("input", () => {
    state.term = workshopFilter.value;
    renderWorkshops();
});

workshopList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-workshop-id]");
    if (button) showWorkshopDetail(button.dataset.workshopId);
});

initialize();