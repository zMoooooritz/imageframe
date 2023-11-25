
function custom_confirm(form, header, text, no, yes) {
    var modal_submit = false;

    $(form).on('submit', function(event) {
        if (modal_submit) {
            modal_submit = false;
            return true;
        }

        event.preventDefault();
        $('#modal_header').html(header);
        $('#modal_text').html(text);
        $('#modal_no').html(no);
        $('#modal_yes').html(yes);
        $('#modal').modal('show');
    });

    $('#modal_yes').on('click', function(){
        $('#modal').modal('hide');
        modal_submit = true;
        $(form).submit();
    });
}

function custom_confirm_alt(form, header, text, no, yes) {
    var modal_submit = false;

    $(form).on('submit', function(event) {
        if (modal_submit) {
            modal_submit = false;
            return true;
        }

        event.preventDefault();
        $('#modal_alt_header').html(header);
        $('#modal_alt_text').html(text);
        $('#modal_alt_no').html(no);
        $('#modal_alt_yes').html(yes);
        $('#modal_alt').modal('show');
    });

    $('#modal_alt_yes').on('click', function(){
        $('#modal_alt').modal('hide');
        modal_submit = true;
        $(form).submit();
    });
}
