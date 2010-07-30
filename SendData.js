var SendData = (function () {
    var SendData;
    var CRLF = '\n';

    SendData = function () {
        this.data = [];
    };

    SendData.prototype.append = function append (name, value) {
        this.data.push({'name' : name, 'value' : value});
    };

    SendData.prototype.send = function (XMLHttpRequestInstance) {
        var boundary, boundaryString, request, data, objectType, fieldCount, appendCount, temp, reader;

        boundaryString = 'SendDataJs' + (+new Date);
        boundary = '--' + boundaryString;
        request =  '';
        fieldsCount = this.data.length;
        appendCount = 0;


        function addField (data) {
            appendCount += 1;
            request += data;

            if (fieldsCount == appendCount) {

                request += CRLF + boundary + CRLF;                
                
                XMLHttpRequestInstance.setRequestHeader('Content-type', 'multipart/form-data; boundary="' + boundaryString + '"');
                XMLHttpRequestInstance.setRequestHeader('Connection', 'close');
                XMLHttpRequestInstance.setRequestHeader('Content-Length', request.length);
                XMLHttpRequestInstance.send(request);
            }
        }


        for (var i = 0; i < fieldsCount; i++) {
            data = this.data[i];            
            objectType = Object.prototype.toString.call(data['value']);

            if (objectType == '[object File]') {
                reader = new FileReader();

                reader.onerror = (function (that) {
                    return function () {
                        if (typeof that.onerror == 'function') {
                            that.onerror('file read error');
                        }
                    }
                })(this);

                reader.onload = (function (reader, data) {
                    return function () {
                        temp  = boundary + CRLF;
                        temp += 'Content-Disposition: form-data; name="' + data['name'];
                        temp += '"; filename="' + data['value'].name  + '"' + CRLF;
                        temp += 'Content-Type: ' + data['value'].type + CRLF;
                        temp += CRLF;

                        temp += reader.result;

                        addField(temp);
                    };
                })(reader, data);

                reader.readAsBinaryString(data['value']);
            }
            else {
                temp = boundary + CRLF;
                temp += 'Content-Disposition: form-data; name="' + data['name'] + '"' + CRLF;
                temp += CRLF;

                temp += data['value'];
                temp += CRLF;

                addField(temp);
            }
        }
    };

    SendData.fromForm = function (form) {
        var sd = new SendData(), element;
        
        for (var i = 0; i < form.elements.length; i++) {
            element = form.elements[i];
            
            if (!element.name) {
                continue; 
            }
            
            if (element.type == 'text' || element.type == 'password' ||
                element.type == 'input' || element.type == 'submit' ||
                element.nodeName.toLowerCase() == 'textarea') {
                    sd.append(element.name, element.value);
            }
            else if (element.type == 'radio' || element.type == 'checkbox') {
                if (element.checked) {
                    sd.append(element.name, element.value);
                }
            }
            else if (element.nodeName.toLowerCase() == 'select') {
                for (var b = 0; b < element.options.length; b++) {                    
                    
                    if (element.options[b].selected) {
                        sd.append(element.name, element.options[b].value);
                    }
                }
            }
            else if (element.type == 'file') {
                if (element.files) {
                    for (var b = 0; b < element.files.length; b++) {
                        sd.append(element.name, element.files[b]);
                    }
                }
                else {
                    sd.append(element.name, element.value); /* not really usefull */
                }
            }
        }
        
        return sd;
    };

    return SendData;
})();
