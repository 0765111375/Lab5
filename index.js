const express = require('express');
const index = express();
index.use(express.json());
const port = process.env.port || 3000;
index.listen(port,()=>{
    console.log("Server Listening on port:", port);
})

let bookData=[]
let bookCounter=1;
let detailsCounter=1;

index.get('/whoami',(request,response)=>{
 

     return response.json({studentNumber:"2558137"});
});

index.get('/books',(request,response)=>{

    return response.send(bookData);
}); 

index.get('/books/:id',(request,response)=>{

    const book=bookData.find(b=>b.id===request.params.id);
    if(!book){
        return response.status(404).send({error:'Book not found'})
    }
    return response.send(book);
});

index.post('/books',(request,response)=>{

    const {id,title,details}=request.body;
    if(!id || !title ||typeof title!=='string'|| !details || !Array.isArray(details)){
        return response.status(400).send({error:'Request invalid'});
    }
    const newBook ={id:String(bookData.length+1),title,details}
    bookData.push(newBook);
    response.status(201).send(newBook);
});

index.put('/books/:id',(response,request)=>{
    const {id}= request.params;
    const {title,details}=request.body;
    const bookInfo = bookData.find(b=>b.id===id);
    if(!bookInfo){
        return response.status(404).send({error:'Book not found'});
    }
    
    for(i of details){
        const{id,author,genre,publishYear} = i;
        if(!id||!author||!genre||!publishYear){
            return response.status(400).send({error:'Book not found'});
            

        }
    }

    bookData[bookInfo].title= title;
    bookData[bookInfo].details=details;

    
    response.send(bookInfo);
});

index.delete('/books/:id',(request,response)=>{

    const bookIndex = bookData.findIndex(b =>b.id===request.params.id);
    if(bookIndex===-1){
        return response.status(404).send({error:'Book not found'});
    }
    bookData.splice(bookIndex,1);
    response.status(204).send();
});

index.post('/books/:id/details',(request,response)=>{

    const {author,genre,publicationYear} = request.body;
    if(!author|| typeof author!=='string'||!genre||typeof genre!=='string'||!publicationYear||typeof publicationYear!=='number'){
        return response.status(400).send({error:'Request invalid'});
    }
    const bookDetails = bookData.find(b=>b.id===request.params.id);
    if(!bookDetails){
        return response.status(404).send({error:'Book not found'});
    }
    const addDetails={
        id:(detailsCounter++).toString(),
        author,
        genre,
        publicationYear
    };
    bookDetails.details.push(addDetails);
    response.status(201).send(addDetails);

});

index.delete('/books/:id/details/:detailId',(request,response)=>{
    const book= bookData.find(b=>b.id===request.params.id);
    if(!book){
        return response.status(404).send({error:'Book not found'});
    }
    const bookIndex = book.details.findIndex(b=>b.id===request.params.id);
    if(bookIndex===-1){
        return response.status(404).send({error:'Details not found'});
    }
    book.details.splice(bookIndex,1);
    response.status(204).send();
})


