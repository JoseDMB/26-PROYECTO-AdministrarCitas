//Selectores
const pacienteInput = document.querySelector('#paciente');
const propietarioInput = document.querySelector('#propietario');
const emailInput = document.querySelector('#email');
const fechaInput = document.querySelector('#fecha');
const sintomasInput = document.querySelector('#sintomas'); 
const contenedorCitas = document.querySelector('#citas')
const formulario = document.querySelector('#formulario-cita');
const btnEditar = document.querySelector('.btn-editar');
const formularioInput = document.querySelector('#formulario-cita input[type="submit"]')

let editando = false;

//objeto de cita
const citaObj = {
    id : generarId(),
    paciente : '',
    propietario : '',
    email : '',
    fecha : '',
    sintomas : '',
}


//Eventos


pacienteInput.addEventListener('input',datosCita )

propietarioInput.addEventListener('input',datosCita)

emailInput.addEventListener('input', datosCita)

fechaInput.addEventListener('input', datosCita)

sintomasInput.addEventListener('input',datosCita)

formulario.addEventListener('submit', submitCita)

class Notificacion{
    constructor({texto, tipo}){
        this.texto = texto;
        this.tipo = tipo;
        this.mostrar();//Llama al metodo al instaciar la clase
    }
 
    mostrar(){
        const alerta = document.createElement('div');
        alerta.classList.add('text-center','w-full','p-3','text-white','my-5'
            ,'alert','uppercase','font-bold', 'text-sm')

        //Elimina alertas duplicadas

        const alertaPrevia = document.querySelector('.alert')
        
        alertaPrevia?.remove();//metodo para ver si existe-->haga si no-->no haga
        


        //Si es de tipo error agrega clase
        this.tipo === 'error' ? alerta.classList.add('bg-red-500') : alerta.classList.add
        ('bg-green-500');

        //Mensaje de error
        alerta.textContent = this.texto;

        //Inserta DOM
        formulario.parentElement.insertBefore(alerta, formulario);

        //Quitar despues de 3 segundos
        setTimeout(()=>{
            alerta.remove()
        },3000);
    }
}

class AdminCitas{
    constructor(){
        this.citas = [];
        
    }

    agregar(cita){
        this.citas =[... this.citas, cita];
        this.mostrar();
    }

    editar(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
        this.mostrar();
    }

    eliminar(id){ //Hace un arreglo nuevo con todos los id's que no son iguales al indicado
        this.citas = this.citas.filter(cita => cita.id !== id);
        this.mostrar();
    }

    mostrar(){
        //Limpia HTML
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }

        //Si hay citas
        if(this.citas.length === 0){
            contenedorCitas.innerHTML = '<p class="text-xl mt-5 mb-10 text-center">No Hay Pacientes :)</p>'
            return;
        }

        //Generando las citas
        this.citas.forEach(cita => {
            const divCita = document.createElement('div');
            divCita.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10' ,'rounded-xl', 'p-3');
        
            const paciente = document.createElement('p');
            paciente.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            paciente.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${cita.paciente}`;
        
            const propietario = document.createElement('p');
            propietario.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            propietario.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${cita.propietario}`;
        
            const email = document.createElement('p');
            email.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${cita.email}`;
        
            const fecha = document.createElement('p');
            fecha.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${cita.fecha}`;
        
            const sintomas = document.createElement('p');
            sintomas.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            sintomas.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${cita.sintomas}`;

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2',
                'btn-editar'
            );
            btnEditar.innerHTML = 'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
            const clone = structuredClone(cita)
            btnEditar.onclick = () => cargarEdicion(clone);


            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            btnEliminar.onclick = () => this.eliminar(cita.id);


            const contenedorBotones = document.createElement('DIV');
            contenedorBotones.classList.add('flex', 'justify-between', 'mt-10' )

            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);

            // Agregar al HTML

            divCita.appendChild(paciente);
            divCita.appendChild(propietario);
            divCita.appendChild(email);
            divCita.appendChild(fecha);
            divCita.appendChild(sintomas);
            divCita.appendChild(contenedorBotones); 
            contenedorCitas.appendChild(divCita);
            
        });   
        
    }
    
}

 

function datosCita(e){
    citaObj[e.target.name] = e.target.value;
}

function submitCita(e){
    e.preventDefault();

    
    if(Object.values(citaObj).some(valor => valor.trim() === '')){
        const notificacion = new Notificacion({
            texto : 'Todos los campos son obligatorios',
            tipo : 'error'
        });
        
        return;
    }

    if(editando){
        citas.editar({...citaObj});
        const notificacion = new Notificacion({
            texto : 'Actualizado correctamente',
            tipo : 'exito'
        });
    }else{
        console.log('registro nuevo');
        citas.agregar({...citaObj});
        const notificacion = new Notificacion({
            texto : 'Paciente registrado',
            tipo : 'exito'
        });
    }

    formulario.reset();
    reiniciarObjetoCita();

    
}


const citas = new AdminCitas();

function reiniciarObjetoCita(){
//  ~donde escribe~, ~con que se reemplaza~
    Object.assign(citaObj,{
    id: generarId(),
    paciente : '',
    propietario : '',
    email : '',
    fecha : '',
    sintomas : '',
    })  
    formularioInput.value = 'Registrar paciente';
    editando = false;
}


function generarId(){
    return Math.random().toString(36).substring(2) + Date.now()
}

function cargarEdicion(cita){
    Object.assign(citaObj, cita)
    pacienteInput.value = cita.paciente;
    propietarioInput.value = cita.propietario;
    emailInput.value = cita.email;
    fechaInput.value = cita.fecha;
    sintomasInput.value = cita.sintomas;
    
    editando = true;

    formularioInput.value = 'Actualizar paciente';

}




