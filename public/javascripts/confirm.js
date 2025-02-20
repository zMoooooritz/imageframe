
function custom_confirm_fst(form, header, text, no, yes) {
    var modal_submit = false;

    $(form).on('submit', function(event) {
        if (modal_submit) {
            modal_submit = false;
            return true;
        }

        event.preventDefault();
        $('#modal_fst_header').html(header);
        $('#modal_fst_text').html(text);
        $('#modal_fst_no').html(no);
        $('#modal_fst_yes').html(yes);
        $('#modal_fst').modal('show');
    });

    $('#modal_fst_yes').on('click', function(){
        $('#modal_fst').modal('hide');
        modal_submit = true;
        $(form).submit();
    });
}

function custom_confirm_snd(form, header, text, no, yes) {
    var modal_submit = false;

    $(form).on('submit', function(event) {
        if (modal_submit) {
            modal_submit = false;
            return true;
        }

        event.preventDefault();
        $('#modal_snd_header').html(header);
        $('#modal_snd_text').html(text);
        $('#modal_snd_no').html(no);
        $('#modal_snd_yes').html(yes);
        $('#modal_snd').modal('show');
    });

    $('#modal_snd_yes').on('click', function(){
        $('#modal_snd').modal('hide');
        modal_submit = true;
        $(form).submit();
    });
}

function custom_confirm_trd(form, header, text, no, yes) {
    var modal_submit = false;

    $(form).on('submit', function(event) {
        if (modal_submit) {
            modal_submit = false;
            return true;
        }

        event.preventDefault();
        $('#modal_trd_header').html(header);
        $('#modal_trd_text').html(text);
        $('#modal_trd_no').html(no);
        $('#modal_trd_yes').html(yes);
        $('#modal_trd').modal('show');
    });

    $('#modal_trd_yes').on('click', function(){
        $('#modal_trd').modal('hide');
        modal_submit = true;
        $(form).submit();
    });
}
