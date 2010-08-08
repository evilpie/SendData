var SendData = (function () {
    var SendData;
    var LF = '\n';

    
    SendData = function () {
        this.data = [];
    };

    SendData.prototype.append = function append (name, value) {
        this.data.push({'name' : name, 'value' : value});
    };

    SendData.prototype.send = function (XMLHttpRequestInstance) {
        var boundary, boundaryString, request, data, objectType, fieldsCount, appendCount, temp, reader;

        boundaryString = 'SendDataJs' + (+new Date());
        boundary = '--' + boundaryString;
        request =  '';
        fieldsCount = this.data.length;
        appendCount = 0;


        function addField (data) {
            appendCount += 1;
            request += data;

            if (fieldsCount == appendCount) {

                request += boundary + LF;

                XMLHttpRequestInstance.setRequestHeader('Content-Type', 'multipart/form-data; boundary="' + boundaryString + '"');
                XMLHttpRequestInstance.setRequestHeader('Connection', 'close');
                XMLHttpRequestInstance.setRequestHeader('Content-Length', request.length);

                XMLHttpRequestInstance.sendAsBinary(request);
            }
        }


        for (var i = 0; i < fieldsCount; i++) {
            data = this.data[i];
            objectType = Object.prototype.toString.call(data.value);

            if (objectType == '[object File]') {
                reader = new FileReader();

                reader.onerror = (function (that) {
                    return function () {
                        if (typeof that.onerror == 'function') {
                            that.onerror('file read error');
                        }
                    };
                })(this);

                reader.onload = (function (reader, data) {
                    return function () {
                        temp  = boundary + LF;
                        temp += 'Content-Disposition: form-data; name="' + data.name;
                        temp += '"; filename="' + data.value.name  + '"' + LF;
                        temp += 'Content-Type: ' + data.value.type + LF;
                        temp += 'Content-Transfer-Encoding: binary' + LF;
                        temp += LF;

                        temp += reader.result;
                        temp += LF;
                        
                        addField(temp);
                    };
                })(reader, data);

                reader.readAsBinaryString(data.value);
            }
            else {
                temp = boundary + LF;
                temp += 'Content-Disposition: form-data; name="' + data.name + '"' + LF;
                temp += LF;

                temp += data.value;
                temp += LF;

                addField(temp);
            }
        }
    };

    SendData.fromForm = function (form) {
        var sd = new SendData(), element, b;

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
                for (b = 0; b < element.options.length; b++) {
                    if (element.options[b].selected) {
                        sd.append(element.name, element.options[b].value);
                    }
                }
            }
            else if (element.type == 'file') {
                if (element.files) {
                    for (b = 0; b < element.files.length; b++) {
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
