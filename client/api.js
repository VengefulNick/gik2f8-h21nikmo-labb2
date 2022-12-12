class Api {
    url = '';

    constructor(url) {
        this.url = url;
    }

    // Create / POST
    create(data){
        const JSONData = JSON.stringify(data);

        const request = new Request(this.url, {
            method: 'POST',
            body: JSONData,
            headers: {
                'content-type' : 'application/json'
            }
        });

        return fetch(request)
            .then((result) => result.json())
            .then((data) = data)
            .catch((err) => console.log(err.stack));
    }

    // Read / GET
    getAll(){
        return fetch(this.url)
            .then((result) => result.json())
            .then((data) => data)
            .catch((err) => console.log(err));
    }

    // Update / PUT
    update(id) {
        console.log(`Updating task with id ${id}`);

        return fetch(`${this.url}/${id}`, {
            method: 'PUT'
        })
            .then((result) => result)
            .catch((err) => console.log(err));
    }

    // Delete / DELETE
    remove(id) {
        console.log(`Removing task with id ${id}`);
    
        return fetch(`${this.url}/${id}`, {
          method: 'DELETE'
        })
          .then((result) => result)
          .catch((err) => console.log(err));
      }
}