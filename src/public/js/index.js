
const socket = io()
const formulario = document.querySelector('#formulario')
const divAdd = document.querySelector('#grid')

const productosHtml = (products)=>{
    products.forEach(producto => {
        const { title, description, code, category, price, stock, id} = producto
        const nuevaLista = document.createElement('div')
        nuevaLista.classList.add('contenedor-lista')
        nuevaLista.innerHTML = `
        <ul class="lista-productos">
            <li><span>Title: </span>${title}</li>
            <li><span>Desciption: </span>${description}</li>
            <li><span>Price: </span>${price}</li>
            <li><span>Stock: </span>${stock}</li>
            <li><span>Code: </span>${code}</li>
            <li><span>Category: </span>${category}</li>
        </ul> 
        <button id="button-list" class="button-list" data-id=${id}>X</button>`
    divAdd.appendChild(nuevaLista)
    });
}

const limpiarHtml= () =>{
    if(divAdd.firstChild)
    while(divAdd.firstChild){
        divAdd.removeChild(divAdd.firstChild)
    }
}


divAdd.addEventListener('click', (e)=>{
    if(e.target.className === 'button-list'){
        const button = (e.target).getAttribute('data-id')
        socket.emit('delete', button)
        
        
    }
})

formulario.addEventListener('submit', (e) => {
    e.preventDefault()
    const form = {
        id:Math.floor(Math.random() * 999999).toString(),
        title: formulario.querySelector('#title').value,
        description: formulario.querySelector('#description').value,
        code: formulario.querySelector('#code').value,
        price: formulario.querySelector('#price').value,
        stock: formulario.querySelector('#stock').value,
        category: formulario.querySelector('#category').value,
    }
    socket.emit('form', form)
    formulario.querySelector('#title').value = ''
    formulario.querySelector('#description').value = ''
    formulario.querySelector('#code').value = ''
    formulario.querySelector('#price').value = ''
    formulario.querySelector('#stock').value = ''
    formulario.querySelector('#category').value = ''
    
})

socket.on('products', data =>{
    limpiarHtml()
    productosHtml(data)
})

socket.on('form-add', data => {
    limpiarHtml()
    productosHtml(data)

})

socket.on('delete-product', data =>{
    limpiarHtml()
    productosHtml(data)
})

const numero = Math.floor(Math.random() * 999999).toString()
