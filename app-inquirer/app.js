import colors from 'colors';
import  { guardarDB, leerDB } from './helpers/guardarArchivo.js';
import { 
    confirmar,
    inquirerMenu,
    leerInput,
    listaTareaBorrar,
    mostrarListadoChecklist,
    pausa
} from './helpers/inquirer.js';
import Tareas from './models/tareas.js';

const main = async() => {
    
    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if ( tareasDB) {
        tareas.cargarTareasArray( tareasDB );
    }
   
    do {
        opt = await inquirerMenu();
        
        switch (opt) {
            case '1':
                const desc = await leerInput('Descripión: ');
                tareas.crearTarea( desc );
            break;
        
            case '2': // mostrar todas las tareas
                tareas.listadoCompleto();
            break;

            case '3': // mostrar tareas completadas
                tareas.listarPendComp();
            break;

            case '4': // mostrar tareas pendientes
                tareas.listarPendComp(false);
            break;
            
            case '5': // completado | pendiente
                const ids = await mostrarListadoChecklist(tareas.listaArray);
                tareas.toogleCompletadas( ids );
            break;
            
            case '6': // borrar tarea
                const id = await listaTareaBorrar( tareas.listaArray);
                if ( id !== '0') {
                    const ok = await confirmar('¿Está seguro que desea borrar?');
                    if(ok) {
                        tareas.borrarTarea(id);
                    }
                }
            break;
        }
        
        guardarDB( tareas.listaArray );
        
        await pausa();
        
    } while (opt !== '0');

}

main();