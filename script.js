$(document).ready(function () {
    var data = [];
    var emailVerify = [];
    var pwdCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    $("#myTable").DataTable({
        data: data,
        columns: [
            { data: 'fName', className: 'dt-head-center' },
            { data: 'lName', className: 'dt-head-center' },
            { data: 'email', className: 'dt-head-center' },
            { data: 'pwd', className: 'dt-head-center' },
            { data: 'btn', className: 'dt-head-center' }
        ]
    });
    
    $(".form-control").click(function () {
        var tag = ($(this).attr("id"));
        if(tag=='pwd')
        {
            passInfo()
        }
        else{
            clearInfo()
        }
    }
    )

    $("#pwd").on("input", function(){

        if (!pwdCheck.test($("#pwd").val()))
        {
            colorInfo()
        }
        else{
            $("#passCap").css("color", "green");
            $("#passCap").css("text-shadow", " 0 0 10px rgb(124, 255, 101)");
            
        }
        
    })

    $("#empFormSubmit").click(function () {
        var fName = $("#fName").val();
        var lName = $("#lName").val();
        var email = $("#email").val();
        var pwd = $("#pwd").val();
        var checkpwd = $("#checkpwd").val();
    
        


        if (fName === '' || lName === '' || email === '' || pwd === '' || checkpwd === '') {
            Swal.fire({
                title: "Error",
                text: "please fill all Information",
                icon: "error"
            });
            return;
        }


       

        var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i   //checking valid email or not

        if (!pattern.test(email)) {
            Swal.fire({
                title: "Invalid Email",
                text: "Please fill correct email",
                icon: "error"
            });
            return;
        }



        if (emailVerify.indexOf(email) != -1) {
            Swal.fire({
                title: "Try new Email",
                text: `${email} Already Exist`,
                icon: "error"
            });
            return;
        }
        else if(!pwdCheck.test($("#pwd").val()))
        {
            Swal.fire({
                title: "Password Error",
                text: "Min 8 character and must contain atleast one upper case, lower case, number and symbol (@$!%*?&)",
                icon: "error"
            });
            return;
        }
        else if(checkpwd!==pwd)
        {
            Swal.fire({
                title: "Password Error",
                text: "Your Password does't match",
                icon: "error"
            });
            return;
        }
        else {
            emailVerify.push(email);
        }

        var pass = pwd;
        const secret = 'mai_nhi_bataunga';
        let encrypt = CryptoJS.AES.encrypt(pass, secret).toString();
        encrypt = encrypt.substring(0, 15);
        console.log(encrypt);


        var empData = {
            fName: fName,
            lName: lName,
            email: email,
            pwd: encrypt,
            btn: `<button class="fa fa-trash btn btn-danger btn-md" id="${email}"></button>`
        }

        data.push(empData);
        addData();
        clearField();



        $("body").on('click', '.btn-danger', function () {                 //making a function for deleting the data of tabel

            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to recover this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {

                if (result.isConfirmed) {

                    var id = ($(this).attr("id"));
                    var dnm = {};
                    dnm = data.filter(a => a.email == id);
                    dnm = dnm[0];
                    data = data.filter(a => a.email !== id);

                    addData();

                    var emailDEL = emailVerify.indexOf(dnm.email);
                    emailVerify.splice(emailDEL);


                    Swal.fire({
                        title: "Deleted!",
                        text: `${dnm.fName} record has been deleted.`,
                        icon: "success"
                    });
                }
            });
        });
    });

    function clearField() {      //making fuction for clearing all fields after performing operation
        $("#fName").val("");
        $("#lName").val("");
        $("#email").val("");
        $("#pwd").val("");
        $("#checkpwd").val("");
    }

    function passInfo()
    {
        $("#passCap").text('Min 8 character and must contain atleast one upper case, lower case, number and symbol (@$!%*?&)')
    }

    function clearInfo()
    {
        $("#passCap").text("")
    }

    function colorInfo()
    {
        $("#passCap").css("color", "red");
        $("#passCap").css("text-shadow", "0 0 10px rgba(255, 4, 4, 0.8)");
    }

    function addData()
    {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Your data has been saved",
            showConfirmButton: false,
            timer: 1500
          });
        $("#myTable").DataTable().clear().rows.add(data).draw();
         colorInfo()

    }
});