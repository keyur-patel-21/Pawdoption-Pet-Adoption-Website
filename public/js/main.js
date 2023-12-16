(function ($) {

    let requestConfig = {
      method: 'GET',
      url: 'http://localhost:3000/pets'
    };

    console.log("in ajax")

// page load
    $.ajax(requestConfig).then(function (responseMessage) {
        console.log(" requestConfig: " ,requestConfig)
        //console.log("#")
        console.log(req.session.user)
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