$(document).ready(function () {
            var siljatune = document.createElement('audio');
            siljatune.setAttribute('src', 'audio/Siljaline.mp3');
            siljatune.setAttribute('preload','auto');
            siljatune.addEventListener('ended', function() {
                this.play();
            }, false);

            // kalenteri 
            var calendarData;
            var currentDate = new Date();
            var weekdays = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
            var months = ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'];
            var days_in_month = [31,28,31,30,31,30,31,31,30,31,30,31];
            var month = 9;
            var year = 2017;
            createCalendar();

            // kalenterin päivien valinta
            var clicks = 0;
            var timeout = null;

            // lomakkeen validointi
            var nameOK = false;
            var bdayOK = false;
            var emailOK = false;
            var buffetOK = false;

            // ilmoittautumislomakkeen henkilömärä
            var osallistujat = 1;

// --------------- NAVIGOINTI ---------------

            // scrollausta varten navin linkkien listaus
            var lastSection = '';
            var sectionList = $('.navbar').find('a');
            var sections = sectionList.map(function () {
                var section = $($(this).attr('href'));
                if (section.length) {
                    return section;
                }
            });

            // hover vaihtaa navin "kotisivun" logon väriä
            $("#homepage").hover(function() {
                $("#logo").attr("src","icons/cruise.png");
            }, function() {
                if (!$('li').first().hasClass('active')) {
                    $("#logo").attr("src","icons/cruise_blue.png");
                }
            });

            // navin linkkien klikkaaminen scrollaa halutun section kohdalle 1000ms animaatiolla
            $('a[href^="#"]').on('click', function (e) {
                e.preventDefault();
                var sectionId = $(this).attr('href');
                var fromTop = $(sectionId).offset().top;
                if (sectionId == "#home") {
                    $("#logo").attr("src","icons/cruise.png");
                } else {
                    $("#logo").attr("src","icons/cruise_blue.png");
                }
                $('html, body').stop().animate({
                    scrollTop: fromTop
                }, 1000);   
            })

            // sivun scrollaaminen vaihtaa navin linkit aktiiviseksi sen mukaan missä osassa sivua käyttäjä on
            $(window).scroll(function () {
                var fromTop = $(this).scrollTop() +52 ;
                var currentSection = sections.map(function () {
                    if ($(this).offset().top < fromTop) return this;
                })
                currentSection = currentSection[currentSection.length - 1];
                var id = currentSection && currentSection.length ? currentSection[0].id : "";
                if (lastSection !== id) {
                    lastSection = currentSection[0].id;
                    sectionList.parent().removeClass("active").end().filter("[href='#" + id + "']").parent().addClass("active");
                    // vaihtaa logon värin samalla kun "etusivulle" scrollataan
                    if (id == "home") {
                        $("#logo").attr("src","icons/cruise.png");
                    } else {
                        $("#logo").attr("src","icons/cruise_blue.png");
                    }
                }
            })


// --------------- ILMOITTAUTUMISLOMAKE ---------------

            // tarkistaa, että  nimi/syntymäaika/sähköposti/buffet on oikeaa muotoa, kun käyttäjä klikkaa pois inputista
            $("#nimi1, #nimi2, #nimi3, #nimi4").blur(checkName);
            $("#synt1, #synt2, #synt3, #synt4").blur(checkBday);
            $("#email1, #email2, #email3, #email4").blur(checkEmail);
            $("#ruokailut1, #ruokailut2, #ruokailut3, #ruokailut4").blur(checkBuffet);


            // lisää klikattaessa hyttikavereiden ilmoittautumislomakkeet yksi kerrallaan
            $("#lisaaHlo").click(function() {
                osallistujat++;
                switch(osallistujat) {
                    case 2:
                        $("#hlo2").fadeIn();
                        $('#poistaHlo').fadeIn();
                        break;
                    case 3:
                        $("#hlo3").fadeIn();
                        break;
                    case 4:
                        $(this).hide();
                        $("#hlo4").fadeIn();  
                } 
                return false;
            });

            // poistaa klikattaessa hyttikavereiden viimeisen ilmoittautumislomakkeen ja resetoi sen inputit
            $("#poistaHlo").click(function() {
                osallistujat--;
                switch(osallistujat) {
                    case 1:
                        resetForm('#hlo2');
                        $("#hlo2").fadeOut();
                        $(this).fadeOut();
                        break;
                    case 2:
                        resetForm('#hlo3');
                        $("#hlo3").fadeOut();
                        break;
                    case 3:
                        resetForm('#hlo4');
                        $("#hlo4").fadeOut();
                        $('#lisaaHlo').fadeIn();
                } 
                return false;
            });

            // lomakkeen lähetys, jos onnistuu soittaa siljalinen tunnarin
            $("#submit").click(function(e) {
                e.preventDefault();
                checkValidInputs();
                if(!nameOK || !bdayOK || !emailOK || !buffetOK) {
                    $("#form-message").html("Lähettäminen epäonnistui. Tarkista, että kaikki syöttämäsi tiedot ovat oikein.");
                } else {
                    var dataString = "";
                    for(var i=1; i<=osallistujat;i++) {
                        var name = $('#nimi'+i).val();
                        var bday = $('#synt'+i).val().split("-").reverse().join("-");
                        var email = $('#email'+i).val();
                        var buffet = $('#ruokailut'+i).val();
                        var rastit = "";
                        if($("#rastikierros" + i).is(':checked')) {
                            rastit = "Kyllä";
                        } else {
                            rastit = "Ei";
                        }
                        dataString += "nimi" + i + "=" + name + "&synt_aika" + i + "=" + bday + "&sposti" + i + "=" + email + "&buffet" + i + "="  + buffet + "&rastikierros" + i + "=" + rastit;
                        if (i<osallistujat) {
                            dataString += "&";
                        }
                    }
                    $.ajax({
                        type:"POST",
                        url:"http://users.metropolia.fi/~mirkon/form.php",
                        data: dataString,
                        cache: false,
                        success: function(str) {
                            $("#form-message").html(str);
                            $("#play").show();
                            $('#submit').remove();
                            $('#lisaaHlo').remove();
                            $('#poistaHlo').remove();
                            for(var i=1;i<=osallistujat;i++) {
                                resetForm('#hlo'+i);
                            }
                        },
                        error: function(str) {
                            alert(str);
                        }
                    });
                    siljatune.play(); 
                }  
                return false;            
            });

            // (ilmoittautumisen jälkeen) audion stop/play -nappi
            $("#play").click(function() {
                  if (siljatune.paused == false) {
                    siljatune.pause();
                    $(this).text("Play");
                  } else {
                    siljatune.play();
                    $(this).text("Pause");
                  }
                  return false;
            });


// --------------- KALENTERI JA ÄÄNESTYS, OLETUKSENA LOKAKUU 2017 ---------------

            // kalenterin päivien valitseminen (koneella click, mobiilissa dblclick)
            $(document).on('click','td[id]', function(){
                if(window.innerWidth > 768) {
                    $(this).toggleClass('selectedDate');
                    $(this).find('span').toggleClass('white-text');
                } else {
                    clicks++;
                    if(clicks === 1) {
                        timeout = setTimeout(function() {
                            clicks = 0;
                        }, 500);
                    } else {
                        clearTimeout(timeout);
                        $(this).toggleClass('selectedDate');
                        $(this).find('span').toggleClass('white-text');
                        clicks = 0;
                    }
                }
            })

            // tuplaklikkaus estetty
            $(document).on('click','td[id]', function(e){
                    e.preventDefault(); 
            });
            

            
            // äänestä-nappi lisää käyttäjän valitsemille päivämäärille yhden äänen tietokantaan  
            $("#äänestä").click(function() {
                var dateString = "";
                var dates = [];
                var selected = $('.selectedDate').length;

                if(selected == 0) {
                    alert("Valitse päivämäärät ensin");
                } else {
                    $('.selectedDate').each(function() {
                        var monthNumber = month +1;
                        var dateNumber = $(this).find('span.date').text();
                        var date = ("0" + dateNumber).slice(-2) + '.' + ('0' + (monthNumber)).slice(-2) + '.';
                        var d = new Date(year, month, dateNumber-1,0,0,0,0);
                        var weekday = weekdays[d.getDay()];
                        dates.push({
                            'date' : date,
                            'day' : weekday
                        });
                    });                    
                    $.ajax({
                        type:"POST",
                        url:"http://users.metropolia.fi/~mirkon/vote.php",
                        data: {'data' : JSON.stringify(dates)},
                        cache: false,
                        success: function(str) {
                            $('table').find('td').removeClass('selectedDate').end().find('td span').removeClass('white-text');
                            $('table').fadeOut(200);
                            $('.controls').fadeOut(200);
                            $('#results').fadeIn(700);            
                            createGraph('#results');
                            $('#result-message').text(str);
                        },
                        error: function(str) {
                            $('#result-message').text(str);
                        }
                    });
                } 
            });
            
            // kalenterin nuoli vasemmalle siirtää edelliseen kuukauteen
            $(document).on('click', '#last-month',function() {
                if(month == 0) {
                    year--;
                    month = 11;
                } else if(month == 11) {
                    month--;
                    $('#title').next().replaceWith('<th id="next-month"> <img src="icons/right-arrow.png"></th>');
                } else {
                    month--;
                    if(month == currentDate.getMonth() && year == currentDate.getFullYear()) {
                        $('#last-month').replaceWith('<th></th>');
                    }
                }
                updateCalendar(month);
            })

            // kalenterin nuoli oikealle siirtää seuraavaan kuukauteen
            $(document).on('click', '#next-month',function() {
                if(month == 10) {
                    $('#next-month').replaceWith('<th></th>');
                    month++;
                    /*
                    year++;
                    month = 0;
                    */
                } else {
                    if(month == currentDate.getMonth() && year == currentDate.getFullYear()) {
                        $('#title').prev().replaceWith('<th id="last-month"> <img src="icons/left-arrow.png"></th>');
                    }
                    month++;
                }
                updateCalendar(month);
            })


            // näyttää äänestys-preview ikkunan 
            $('#tulokset').click(function() {
                $('#result-preview-wrap').replaceWith('<div id="result-preview-wrap"> <button class="close">X</button> </div>');
                $('#result-preview').fadeIn();
                createGraph('#result-preview-wrap')
            });

            // sulkee äänestys-preview ikkunan kun sen ulkopuolelle klikataan
            $('#result-preview').click(function() {
                $(this).fadeOut();
            })



// --------------- FUNKTIOT ---------------

            // luo kalenterin ja lisää päiviin tietokannassa olevat hinnat sekä tapahtumat
            function createCalendar(){
                // kuukauden ensimmäinen päivä
                var firstDay = new Date(year, month, 7);
                var startingDay = firstDay.getDay();
              
                // kuukauden päivien lukumäärä
                var monthLength = days_in_month[month];
              
                // karkausvuosi, helmikuussa 29pvä
                if (month == 1) {
                  if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0){
                    monthLength = 29;
                  }
                }
              
                // kalenterin thead
                var monthName = months[month]
                var html = '<table>';
                html += '<thead><tr><th id="last-month"> <img src="icons/left-arrow.png"></th>';
                html += '<th id="title" colspan="5">' + monthName + '&nbsp;' + year + '</th>';
                html += '<th id="next-month"> <img src="icons/right-arrow.png"></th>';

                html += '</tr><tr>';
                for(var i = 0; i <= 6; i++ ){
                    html += '<th>' + weekdays[i] + '</th>';
                }
                html += '</tr></thead>';


                $.get("http://users.metropolia.fi/~mirkon/api.php/prices", function(data) {
                    calendarData = JSON.parse(data);
                
                    html += '<tbody><tr>'
                    var day = 1;
                    // viikot (rivit)
                    for (var i = 0; i < 9; i++) {
                        // päivät (solut)
                        for (var j = 0; j <= 6; j++) { 
                            // td ID = pp.kk.
                            var dateID = ("0" + day).slice(-2) + '.' + ('0' + (month +1)).slice(-2) + '.';
                            var price = '';
                            var event = '';
                            // käy kaikki tietokannan päivät läpi ja lisää kalenteriin hinnan sekä tapahtuman, jos niitä on
                            for(var k=0; k<calendarData.length;k++) {
                                if(calendarData[k]['date'] == dateID) {
                                    price = calendarData[k]['price'];
                                    event = calendarData[k]['event'];
                                }
                            }
                            if (day <= monthLength && (i > 0 || j >= startingDay)) {
                                if (event == '') {
                                   html += '<td id="' + dateID + '">';
                                    html += '<span class="date">' + day + '</span>';
                                    html += '<span class="price">' + price + '</span>'; 
                                } else {
                                    html += '<td id="' + dateID + '" data-balloon="' + event + '"data-balloon-pos="up">';
                                    html += '<span class="date noselect">' + day + '</span>';
                                    html += '<span class="price noselect">' + price + '</span>';
                                    html += '<span class="description-wrap"><span class="description">' + event + '</span></span>';
                                }
                                day++;
                            } else {
                                html += '<td>';
                            }
                            html += '</td>';
                        }
                      if (day > monthLength) {
                        break;
                      } else {
                        html += '</tr><tr>';
                      }
                    }
                    html += '</tr></table>';
                    $('#calendar').append(html);
                });
            }

            // päivittää kalenterin näytettävän kuukauden
            function updateCalendar(newMonth) {
                month = newMonth;
                
                $('#title').html(months[month] + '&nbsp;' + year);

                var firstDay = new Date(year, month, 7);
                var startingDay = firstDay.getDay();
                var monthLength = days_in_month[month];
                var html = '<tr>';

                var day = 1;
                // viikot (rivit)
                for (var i = 0; i < 9; i++) {
                    // päivät (solut)
                    for (var j = 0; j <= 6; j++) { 
                        // td ID = pp.kk.
                        var dateID = ("0" + day).slice(-2) + '.' + ('0' + (month +1)).slice(-2) + '.';
                        var price = '';
                        var event = '';
                        // käy kaikki tietokannan päivät läpi ja lisää kalenteriin hinnan sekä tapahtuman, jos niitä on
                        for(var k=0; k<calendarData.length;k++) {
                            if(calendarData[k]['date'] == dateID) {
                                price = calendarData[k]['price'];
                                event = calendarData[k]['event'];
                            }
                        }
                        if (day <= monthLength && (i > 0 || j >= startingDay)) {
                            if (event == '') {
                                    html += '<td id="' + dateID + '">';
                                    html += '<span class="date">' + day + '</span>';
                                    html += '<span class="price">' + price + '</span>'; 
                                } else {
                                    html += '<td id="' + dateID + '" data-balloon="' + event + '" data-balloon-pos="up">';
                                    html += '<span class="date noselect">' + day + '</span>';
                                    html += '<span class="price noselect">' + price + '</span>';
                                    html += '<span class="description-wrap"><span class="description">' + event + '</span></span>';
                                }
                            day++;
                        } else {
                            html += '<td>';
                        }
                        html += '</td>';
                    }
                  if (day > monthLength) {
                    break;
                  } else {
                    html += '</tr><tr>';
                  }
                }
                html += '</tr></table>';
                $('tbody').html(html);
            }

            // luo äänestyksen tulosten perusteella palkkigraafin
            function createGraph(element) {
                $.get("http://users.metropolia.fi/~mirkon/results.php", function(data) {
                    var object = JSON.parse(data);
                    var rows = object.length;
                    if (rows>10) {
                        rows = 10;
                    }
                    for(var i=0; i<rows; i++) {
                        var full_date = object[i]['date'];
                        var date = full_date.split(".");
                        $(element).append($('<div/>').addClass('graph')
                            .append($('<div/>').addClass('title').text(object[i]['day'] + " " + parseInt(date[0], 10) + "." + date[1] + ".") )
                            .append($('<div/>').addClass('barWrap')
                                .append($('<div/>').addClass('bar').text(object[i]['votes'])) )
                        );
                        $('div.bar:last').stop().css('width',0);
                        $('div.bar:last').animate({
                            width: calcWidth(object, i)
                        },800);
                    }
                });
            };

            // laskee äänestettyjen päivämäärien palkin pituuden prosentteina
            function calcWidth(object, index) {
                var maxVotes = object[0]['votes']; 
                var votes = object[index]['votes'];
                var percent = (votes/maxVotes) *100;
                return percent + '%';
            };

            // palauttaa lomakkeen kohdat takaisin tyhjäksi
            function resetForm(hlo) {
                $(hlo).find('input').val('');
                $(hlo).find('input').removeClass();
                $(hlo).find('select').val('--');
                $(hlo).find('select').removeClass();
            };
           
           // tarkistaa onko nimi täytetty oikein, vain aakkoset, välilyönti ja väliviiva kelpaavat 
           function checkName() {
                var namepattern = new RegExp('^[A-Za-zÅÄÖåäö \-]{2,}$');
                var validname = namepattern.test(this.value);
                if (validname) {
                    $(this).addClass("valid-input");
                    $(this).removeClass("invalid-input");
                    nameOK = true;
                } else {
                    $(this).addClass("invalid-input");
                    $(this).removeClass("valid-input");
                    nameOK = false;
                }
            };

            // tarkistaa onko syntymäaika täytetty oikein
            function checkBday() {
                var bdaypattern = new RegExp('^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$');
                var validbday = bdaypattern.test(this.value);
                if (validbday) {
                    $(this).addClass("valid-input");
                    $(this).removeClass("invalid-input");
                    bdayOK = true;
                } else {
                    $(this).addClass("invalid-input");
                    $(this).removeClass("valid-input");
                    bdayOK = false;
                }
            };

            // tarkistaa onko sähköposti oikeaa muotoa, pitää olla jotain@muuta.com
            function checkEmail() {
                var emailpattern = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$');
                var validemail = emailpattern.test(this.value);                
                if (validemail) {
                    $(this).addClass("valid-input");
                    $(this).removeClass("invalid-input");
                    emailOK = true;
                } else {
                    $(this).addClass("invalid-input");
                    $(this).removeClass("valid-input");
                    emailOK = false;
                }
            };

            // tarkistaa onko joku buffet vaihtoehto valittu
            function checkBuffet() {
                var selected = this.value;
                if (selected == "--") {
                    $(this).addClass("invalid-input");
                    $(this).removeClass("valid-input");
                    buffetOK = false;
                } else {
                    $(this).addClass("valid-input");
                    $(this).removeClass("invalid-input");
                    buffetOK = true;
                }
            }

            // tarkistaa nimen, syntymäajan, sähköpostin ja buffetin
            function checkValidInputs() {
                var namepattern = new RegExp('^[A-Za-zÅÄÖåäö \-]+$');
                var bdaypattern = new RegExp('^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$');
                var emailpattern = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$');

                for(var i=1;i<=osallistujat;i++) {
                    
                    // nimi
                    var validname = namepattern.test($('#nimi'+i).val());
                    if (validname) {
                        $('#nimi'+i).addClass("valid-input");
                        $('#nimi'+i).removeClass("invalid-input");
                        nameOK = true;
                    } else {
                        $('#nimi'+i).addClass("invalid-input");
                        $('#nimi'+i).removeClass("valid-input");
                        nameOK = false;
                    }

                    // syntymäaika
                    var validbday = bdaypattern.test($('#synt'+i).val());
                    if (validbday) {
                        $('#synt'+i).addClass("valid-input");
                        $('#synt'+i).removeClass("invalid-input");
                        bdayOK = true;
                    } else {
                        $('#synt'+i).addClass("invalid-input");
                        $('#synt'+i).removeClass("valid-input");
                        bdayOK = false;
                    }


                    // sähköposti
                    var validemail = emailpattern.test($('#email'+i).val());                    
                    if (validemail) {
                        $('#email'+i).addClass("valid-input");
                        $('#email'+i).removeClass("invalid-input");
                        emailOK = true;
                    } else {
                        $('#email'+i).addClass("invalid-input");
                        $('#email'+i).removeClass("valid-input");
                        emailOK = false;
                    }

                    // buffet
                    var selected = $('#ruokailut'+i).val();
                    if (selected == "--") {
                        $('#ruokailut'+i).addClass("invalid-input");
                        $('#ruokailut'+i).removeClass("valid-input");
                        buffetOK = false;
                    } else {
                        $('#ruokailut'+i).addClass("valid-input");
                        $('#ruokailut'+i).removeClass("invalid-input");
                        buffetOK = true;
                    }
                }
            }
})
