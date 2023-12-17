(function ($) {

    let requestConfig = {
      method: 'GET',
      url: 'http://localhost:3000/pets'
    };


// page load
    $.ajax(requestConfig).then(function (responseMessage) {
        $("#delete_link").attr("hidden",false);
        // $("#showDetails").attr("hidden",true);

        // for (const i of responseMessage) {
        // let liElement = $(
        //     `<li>
        //     <a href=${i._links.self.href}> ${ i.name } </a>
        //     </li>`
        //     );
        //     $("#tvShowList").append(liElement);
        // }
        // $("#tvShowList").attr("hidden",false);
    });



})(window.jQuery);