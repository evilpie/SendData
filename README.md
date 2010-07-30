SendData
========

SendData is an Class modleded after FormData to make this functionallity aviable in FireFox 3.5.
The main usefull part is sending files, this feature requires the FileReader.

Example
------

     var xhr, sd, fd;
     
     xhr = new XMLHttpRequest;
     xhr.open('POST', '/upload.php', true) // You need to use post requests
     
     if ('FormData' in window) { // use native FormData if possible
       fd = new FormData(); 
       fd.append('foo', 'bar');
       fd.append('answere', 42);
       fd.append('file', document.getElementById('input_file').files[0]); // <input type="file">
       
       xhr.send(fd);
     }
     else {
       sd = new SendData();
       sd.append('foo', 'bar');
       sd.append('answere', 42);
       sd.append('file', document.getElementById('input_file').files[0]);
       
       sd.send(xhr) // Attention!
     }


Remarkes
-------
SendData internally sets three Request Headers: "Content-Type", "Connection" and "Content-Length"


Methods
-------

SendData#append(name, value)

name: the name of the field, its basically the same as for example the name of an input field
value: can be anything, but File Objects get special treatment

SendData#send(XMLHttpRequestInstance)

XMLHttpRequestInstance: Where the data should be written to


Properties
----------

SendData#onerror = function (message) { }

Assign your handler to this, if you want to get messages when reading a file fails.

Static Method
-------------

SendData.fromForm(form)

form: a html form element

This function is similiar to Mozillas Form#getFormData, and will return a new SendData instance.


Exclaimer
--------
This is my first javascript class i ever wrote, to i would be really happy to get some feedback.
