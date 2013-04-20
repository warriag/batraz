/*
 * jQuery validation plug-in 1.7
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 *
 * $Id: jquery.validate.js 6403 2009-06-17 14:27:16Z joern.zaefferer $
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */ (function ($) {
    $.extend($.fn, {
        validate: function (d) {
            if (!this.length) {
                d && d.debug && window.console && console.warn("nothing selected, can't validate, returning nothing");
                return
            }
            var c = $.data(this[0], 'validator');
            if (c) {
                return c
            }
            c = new $.validator(d, this[0]);
            $.data(this[0], 'validator', c);
            if (c.settings.onsubmit) {
                this.find("input, button").filter(".cancel").click(function () {
                    c.cancelSubmit = true
                });
                if (c.settings.submitHandler) {
                    this.find("input, button").filter(":submit").click(function () {
                        c.submitButton = this
                    })
                }
                this.submit(function (b) {
                    if (c.settings.debug) b.preventDefault();

                    function handle() {
                        if (c.settings.submitHandler) {
                            if (c.submitButton) {
                                var a = $("<input type='hidden'/>").attr("name", c.submitButton.name).val(c.submitButton.value).appendTo(c.currentForm)
                            }
                            c.settings.submitHandler.call(c, c.currentForm);
                            if (c.submitButton) {
                                a.remove()
                            }
                            return false
                        }
                        return true
                    }
                    if (c.cancelSubmit) {
                        c.cancelSubmit = false;
                        return handle()
                    }
                    if (c.form()) {
                        if (c.pendingRequest) {
                            c.formSubmitted = true;
                            return false
                        }
                        return handle()
                    } else {
                        c.focusInvalid();
                        return false
                    }
                })
            }
            return c
        },
        valid: function () {
            if ($(this[0]).is('form')) {
                return this.validate().form()
            } else {
                var b = true;
                var a = $(this[0].form).validate();
                this.each(function () {
                    b &= a.element(this)
                });
                return b
            }
        },
        removeAttrs: function (c) {
            var d = {}, $element = this;
            $.each(c.split(/\s/), function (a, b) {
                d[b] = $element.attr(b);
                $element.removeAttr(b)
            });
            return d
        },
        rules: function (h, k) {
            var f = this[0];
            if (h) {
                var i = $.data(f.form, 'validator').settings;
                var d = i.rules;
                var c = $.validator.staticRules(f);
                switch (h) {
                    case "add":
                        $.extend(c, $.validator.normalizeRule(k));
                        d[f.name] = c;
                        if (k.messages) i.messages[f.name] = $.extend(i.messages[f.name], k.messages);
                        break;
                    case "remove":
                        if (!k) {
                            delete d[f.name];
                            return c
                        }
                        var e = {};
                        $.each(k.split(/\s/), function (a, b) {
                            e[b] = c[b];
                            delete c[b]
                        });
                        return e
                }
            }
            var g = $.validator.normalizeRules($.extend({}, $.validator.metadataRules(f), $.validator.classRules(f), $.validator.attributeRules(f), $.validator.staticRules(f)), f);
            if (g.required) {
                var j = g.required;
                delete g.required;
                g = $.extend({
                    required: j
                }, g)
            }
            return g
        }
    });
    $.extend($.expr[":"], {
        blank: function (a) {
            return !$.trim("" + a.value)
        },
        filled: function (a) {
            return !!$.trim("" + a.value)
        },
        unchecked: function (a) {
            return !a.checked
        }
    });
    $.validator = function (b, a) {
        this.settings = $.extend(true, {}, $.validator.defaults, b);
        this.currentForm = a;
        this.init()
    };
    $.validator.format = function (c, b) {
        if (arguments.length == 1) return function () {
            var a = $.makeArray(arguments);
            a.unshift(c);
            return $.validator.format.apply(this, a)
        };
        if (arguments.length > 2 && b.constructor != Array) {
            b = $.makeArray(arguments).slice(1)
        }
        if (b.constructor != Array) {
            b = [b]
        }
        $.each(b, function (i, n) {
            c = c.replace(new RegExp("\\{" + i + "\\}", "g"), n)
        });
        return c
    };
    $.extend($.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            validClass: "valid",
            errorElement: "label",
            focusInvalid: true,
            errorContainer: $([]),
            errorLabelContainer: $([]),
            onsubmit: true,
            ignore: [],
            ignoreTitle: false,
            onfocusin: function (a) {
                this.lastActive = a;
                if (this.settings.focusCleanup && !this.blockFocusCleanup) {
                    this.settings.unhighlight && this.settings.unhighlight.call(this, a, this.settings.errorClass, this.settings.validClass);
                    this.errorsFor(a).hide()
                }
            },
            onfocusout: function (a) {
                if (!this.checkable(a) && (a.name in this.submitted || !this.optional(a))) {
                    this.element(a)
                }
            },
            onkeyup: function (a) {
                if (a.name in this.submitted || a == this.lastElement) {
                    this.element(a)
                }
            },
            onclick: function (a) {
                if (a.name in this.submitted) this.element(a);
                else if (a.parentNode.name in this.submitted) this.element(a.parentNode)
            },
            highlight: function (a, c, b) {
                $(a).addClass(c).removeClass(b)
            },
            unhighlight: function (a, c, b) {
                $(a).removeClass(c).addClass(b)
            }
        },
        setDefaults: function (a) {
            $.extend($.validator.defaults, a)
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            accept: "Please enter a value with a valid extension.",
            maxlength: $.validator.format("Please enter no more than {0} characters."),
            minlength: $.validator.format("Please enter at least {0} characters."),
            rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
            range: $.validator.format("Please enter a value between {0} and {1}."),
            max: $.validator.format("Please enter a value less than or equal to {0}."),
            min: $.validator.format("Please enter a value greater than or equal to {0}.")
        },
        autoCreateRanges: false,
        prototype: {
            init: function () {
                this.labelContainer = $(this.settings.errorLabelContainer);
                this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
                this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
                this.submitted = {};
                this.valueCache = {};
                this.pendingRequest = 0;
                this.pending = {};
                this.invalid = {};
                this.reset();
                var f = (this.groups = {});
                $.each(this.settings.groups, function (d, c) {
                    $.each(c.split(/\s/), function (a, b) {
                        f[b] = d
                    })
                });
                var e = this.settings.rules;
                $.each(e, function (b, a) {
                    e[b] = $.validator.normalizeRule(a)
                });

                function delegate(a) {
                    var b = $.data(this[0].form, "validator"),
                        eventType = "on" + a.type.replace(/^validate/, "");
                    b.settings[eventType] && b.settings[eventType].call(b, this[0])
                }
                $(this.currentForm).validateDelegate(":text, :password, :file, select, textarea", "focusin focusout keyup", delegate).validateDelegate(":radio, :checkbox, select, option", "click", delegate);
                if (this.settings.invalidHandler) $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler)
            },
            form: function () {
                this.checkForm();
                $.extend(this.submitted, this.errorMap);
                this.invalid = $.extend({}, this.errorMap);
                if (!this.valid()) $(this.currentForm).triggerHandler("invalid-form", [this]);
                this.showErrors();
                return this.valid()
            },
            checkForm: function () {
                this.prepareForm();
                for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
                    this.check(elements[i])
                }
                return this.valid()
            },
            element: function (a) {
                a = this.clean(a);
                this.lastElement = a;
                this.prepareElement(a);
                this.currentElements = $(a);
                var b = this.check(a);
                if (b) {
                    delete this.invalid[a.name]
                } else {
                    this.invalid[a.name] = true
                }
                if (!this.numberOfInvalids()) {
                    this.toHide = this.toHide.add(this.containers)
                }
                this.showErrors();
                return b
            },
            showErrors: function (b) {
                if (b) {
                    $.extend(this.errorMap, b);
                    this.errorList = [];
                    for (var c in b) {
                        this.errorList.push({
                            message: b[c],
                            element: this.findByName(c)[0]
                        })
                    }
                    this.successList = $.grep(this.successList, function (a) {
                        return !(a.name in b)
                    })
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            },
            resetForm: function () {
                if ($.fn.resetForm) $(this.currentForm).resetForm();
                this.submitted = {};
                this.prepareForm();
                this.hideErrors();
                this.elements().removeClass(this.settings.errorClass)
            },
            numberOfInvalids: function () {
                return this.objectLength(this.invalid)
            },
            objectLength: function (a) {
                var b = 0;
                for (var i in a) b++;
                return b
            },
            hideErrors: function () {
                this.addWrapper(this.toHide).hide()
            },
            valid: function () {
                return this.size() == 0
            },
            size: function () {
                return this.errorList.length
            },
            focusInvalid: function () {
                if (this.settings.focusInvalid) {
                    try {
                        $(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                    } catch (e) {}
                }
            },
            findLastActive: function () {
                var a = this.lastActive;
                return a && $.grep(this.errorList, function (n) {
                    return n.element.name == a.name
                }).length == 1 && a
            },
            elements: function () {
                var a = this,
                    rulesCache = {};
                return $([]).add(this.currentForm.elements).filter(":input").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function () {
                    !this.name && a.settings.debug && window.console && console.error("%o has no name assigned", this);
                    if (this.name in rulesCache || !a.objectLength($(this).rules())) return false;
                    rulesCache[this.name] = true;
                    return true
                })
            },
            clean: function (a) {
                return $(a)[0]
            },
            errors: function () {
                return $(this.settings.errorElement + "." + this.settings.errorClass, this.errorContext)
            },
            reset: function () {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = $([]);
                this.toHide = $([]);
                this.currentElements = $([])
            },
            prepareForm: function () {
                this.reset();
                this.toHide = this.errors().add(this.containers)
            },
            prepareElement: function (a) {
                this.reset();
                this.toHide = this.errorsFor(a)
            },
            check: function (d) {
                d = this.clean(d);
                if (this.checkable(d)) {
                    d = this.findByName(d.name)[0]
                }
                var a = $(d).rules();
                var c = false;
                for (method in a) {
                    var b = {
                        method: method,
                        parameters: a[method]
                    };
                    try {
                        var f = $.validator.methods[method].call(this, d.value.replace(/\r/g, ""), d, b.parameters);
                        if (f == "dependency-mismatch") {
                            c = true;
                            continue
                        }
                        c = false;
                        if (f == "pending") {
                            this.toHide = this.toHide.not(this.errorsFor(d));
                            return
                        }
                        if (!f) {
                            this.formatAndAdd(d, b);
                            return false
                        }
                    } catch (e) {
                        this.settings.debug && window.console && console.log("exception occured when checking element " + d.id + ", check the '" + b.method + "' method", e);
                        throw e;
                    }
                }
                if (c) return;
                if (this.objectLength(a)) this.successList.push(d);
                return true
            },
            customMetaMessage: function (a, b) {
                if (!$.metadata) return;
                var c = this.settings.meta ? $(a).metadata()[this.settings.meta] : $(a).metadata();
                return c && c.messages && c.messages[b]
            },
            customMessage: function (a, b) {
                var m = this.settings.messages[a];
                return m && (m.constructor == String ? m : m[b])
            },
            findDefined: function () {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] !== undefined) return arguments[i]
                }
                return undefined
            },
            defaultMessage: function (a, b) {
                return this.findDefined(this.customMessage(a.name, b), this.customMetaMessage(a, b), !this.settings.ignoreTitle && a.title || undefined, $.validator.messages[b], "<strong>Warning: No message defined for " + a.name + "</strong>")
            },
            formatAndAdd: function (b, a) {
                var c = this.defaultMessage(b, a.method),
                    theregex = /\$?\{(\d+)\}/g;
                if (typeof c == "function") {
                    c = c.call(this, a.parameters, b)
                } else if (theregex.test(c)) {
                    c = jQuery.format(c.replace(theregex, '{$1}'), a.parameters)
                }
                this.errorList.push({
                    message: c,
                    element: b
                });
                this.errorMap[b.name] = c;
                this.submitted[b.name] = c
            },
            addWrapper: function (a) {
                if (this.settings.wrapper) a = a.add(a.parent(this.settings.wrapper));
                return a
            },
            defaultShowErrors: function () {
                for (var i = 0; this.errorList[i]; i++) {
                    var a = this.errorList[i];
                    this.settings.highlight && this.settings.highlight.call(this, a.element, this.settings.errorClass, this.settings.validClass);
                    this.showLabel(a.element, a.message)
                }
                if (this.errorList.length) {
                    this.toShow = this.toShow.add(this.containers)
                }
                if (this.settings.success) {
                    for (var i = 0; this.successList[i]; i++) {
                        this.showLabel(this.successList[i])
                    }
                }
                if (this.settings.unhighlight) {
                    for (var i = 0, elements = this.validElements(); elements[i]; i++) {
                        this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass)
                    }
                }
                this.toHide = this.toHide.not(this.toShow);
                this.hideErrors();
                this.addWrapper(this.toShow).show()
            },
            validElements: function () {
                return this.currentElements.not(this.invalidElements())
            },
            invalidElements: function () {
                return $(this.errorList).map(function () {
                    return this.element
                })
            },
            showLabel: function (a, c) {
                var b = this.errorsFor(a);
                if (b.length) {
                    b.removeClass().addClass(this.settings.errorClass);
                    b.attr("generated") && b.html(c)
                } else {
                    b = $("<" + this.settings.errorElement + "/>").attr({
                        "for": this.idOrName(a),
                        generated: true
                    }).addClass(this.settings.errorClass).html(c || "");
                    if (this.settings.wrapper) {
                        b = b.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()
                    }
                    if (!this.labelContainer.append(b).length) this.settings.errorPlacement ? this.settings.errorPlacement(b, $(a)) : b.insertAfter(a)
                }
                if (!c && this.settings.success) {
                    b.text("");
                    typeof this.settings.success == "string" ? b.addClass(this.settings.success) : this.settings.success(b)
                }
                this.toShow = this.toShow.add(b)
            },
            errorsFor: function (a) {
                var b = this.idOrName(a);
                return this.errors().filter(function () {
                    return $(this).attr('for') == b
                })
            },
            idOrName: function (a) {
                return this.groups[a.name] || (this.checkable(a) ? a.name : a.id || a.name)
            },
            checkable: function (a) {
                return /radio|checkbox/i.test(a.type)
            },
            findByName: function (d) {
                var c = this.currentForm;
                return $(document.getElementsByName(d)).map(function (a, b) {
                    return b.form == c && b.name == d && b || null
                })
            },
            getLength: function (a, b) {
                switch (b.nodeName.toLowerCase()) {
                    case 'select':
                        return $("option:selected", b).length;
                    case 'input':
                        if (this.checkable(b)) return this.findByName(b.name).filter(':checked').length
                }
                return a.length
            },
            depend: function (b, a) {
                return this.dependTypes[typeof b] ? this.dependTypes[typeof b](b, a) : true
            },
            dependTypes: {
                "boolean": function (b, a) {
                    return b
                },
                "string": function (b, a) {
                    return !!$(b, a.form).length
                },
                "function": function (b, a) {
                    return b(a)
                }
            },
            optional: function (a) {
                return !$.validator.methods.required.call(this, $.trim(a.value), a) && "dependency-mismatch"
            },
            startRequest: function (a) {
                if (!this.pending[a.name]) {
                    this.pendingRequest++;
                    this.pending[a.name] = true
                }
            },
            stopRequest: function (a, b) {
                this.pendingRequest--;
                if (this.pendingRequest < 0) this.pendingRequest = 0;
                delete this.pending[a.name];
                if (b && this.pendingRequest == 0 && this.formSubmitted && this.form()) {
                    $(this.currentForm).submit();
                    this.formSubmitted = false
                } else if (!b && this.pendingRequest == 0 && this.formSubmitted) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                    this.formSubmitted = false
                }
            },
            previousValue: function (a) {
                return $.data(a, "previousValue") || $.data(a, "previousValue", {
                    old: null,
                    valid: true,
                    message: this.defaultMessage(a, "remote")
                })
            }
        },
        classRuleSettings: {
            required: {
                required: true
            },
            email: {
                email: true
            },
            url: {
                url: true
            },
            date: {
                date: true
            },
            dateISO: {
                dateISO: true
            },
            dateDE: {
                dateDE: true
            },
            number: {
                number: true
            },
            numberDE: {
                numberDE: true
            },
            digits: {
                digits: true
            },
            creditcard: {
                creditcard: true
            }
        },
        addClassRules: function (a, b) {
            a.constructor == String ? this.classRuleSettings[a] = b : $.extend(this.classRuleSettings, a)
        },
        classRules: function (b) {
            var a = {};
            var c = $(b).attr('class');
            c && $.each(c.split(' '), function () {
                if (this in $.validator.classRuleSettings) {
                    $.extend(a, $.validator.classRuleSettings[this])
                }
            });
            return a
        },
        attributeRules: function (c) {
            var a = {};
            var d = $(c);
            for (method in $.validator.methods) {
                var b = d.attr(method);
                if (b) {
                    a[method] = b
                }
            }
            if (a.maxlength && /-1|2147483647|524288/.test(a.maxlength)) {
                delete a.maxlength
            }
            return a
        },
        metadataRules: function (a) {
            if (!$.metadata) return {};
            var b = $.data(a.form, 'validator').settings.meta;
            return b ? $(a).metadata()[b] : $(a).metadata()
        },
        staticRules: function (b) {
            var a = {};
            var c = $.data(b.form, 'validator');
            if (c.settings.rules) {
                a = $.validator.normalizeRule(c.settings.rules[b.name]) || {}
            }
            return a
        },
        normalizeRules: function (d, e) {
            $.each(d, function (c, b) {
                if (b === false) {
                    delete d[c];
                    return
                }
                if (b.param || b.depends) {
                    var a = true;
                    switch (typeof b.depends) {
                        case "string":
                            a = !! $(b.depends, e.form).length;
                            break;
                        case "function":
                            a = b.depends.call(e, e);
                            break
                    }
                    if (a) {
                        d[c] = b.param !== undefined ? b.param : true
                    } else {
                        delete d[c]
                    }
                }
            });
            $.each(d, function (a, b) {
                d[a] = $.isFunction(b) ? b(e) : b
            });
            $.each(['minlength', 'maxlength', 'min', 'max'], function () {
                if (d[this]) {
                    d[this] = Number(d[this])
                }
            });
            $.each(['rangelength', 'range'], function () {
                if (d[this]) {
                    d[this] = [Number(d[this][0]), Number(d[this][1])]
                }
            });
            if ($.validator.autoCreateRanges) {
                if (d.min && d.max) {
                    d.range = [d.min, d.max];
                    delete d.min;
                    delete d.max
                }
                if (d.minlength && d.maxlength) {
                    d.rangelength = [d.minlength, d.maxlength];
                    delete d.minlength;
                    delete d.maxlength
                }
            }
            if (d.messages) {
                delete d.messages
            }
            return d
        },
        normalizeRule: function (a) {
            if (typeof a == "string") {
                var b = {};
                $.each(a.split(/\s/), function () {
                    b[this] = true
                });
                a = b
            }
            return a
        },
        addMethod: function (c, a, b) {
            $.validator.methods[c] = a;
            $.validator.messages[c] = b != undefined ? b : $.validator.messages[c];
            if (a.length < 3) {
                $.validator.addClassRules(c, $.validator.normalizeRule(c))
            }
        },
        methods: {
            required: function (c, d, a) {
                if (!this.depend(a, d)) return "dependency-mismatch";
                switch (d.nodeName.toLowerCase()) {
                    case 'select':
                        var b = $(d).val();
                        return b && b.length > 0;
                    case 'input':
                        if (this.checkable(d)) return this.getLength(c, d) > 0;
                    default:
                        return $.trim(c).length > 0
                }
            },
            remote: function (f, h, j) {
                if (this.optional(h)) return "dependency-mismatch";
                var g = this.previousValue(h);
                if (!this.settings.messages[h.name]) this.settings.messages[h.name] = {};
                g.originalMessage = this.settings.messages[h.name].remote;
                this.settings.messages[h.name].remote = g.message;
                j = typeof j == "string" && {
                    url: j
                } || j;
                if (g.old !== f) {
                    g.old = f;
                    var k = this;
                    this.startRequest(h);
                    var i = {};
                    i[h.name] = f;
                    $.ajax($.extend(true, {
                        url: j,
                        mode: "abort",
                        port: "validate" + h.name,
                        dataType: "json",
                        data: i,
                        success: function (d) {
                            k.settings.messages[h.name].remote = g.originalMessage;
                            var b = d === true;
                            if (b) {
                                var e = k.formSubmitted;
                                k.prepareElement(h);
                                k.formSubmitted = e;
                                k.successList.push(h);
                                k.showErrors()
                            } else {
                                var a = {};
                                var c = (g.message = d || k.defaultMessage(h, "remote"));
                                a[h.name] = $.isFunction(c) ? c(f) : c;
                                k.showErrors(a)
                            }
                            g.valid = b;
                            k.stopRequest(h, b)
                        }
                    }, j));
                    return "pending"
                } else if (this.pending[h.name]) {
                    return "pending"
                }
                return g.valid
            },
            minlength: function (b, c, a) {
                return this.optional(c) || this.getLength($.trim(b), c) >= a
            },
            maxlength: function (b, c, a) {
                return this.optional(c) || this.getLength($.trim(b), c) <= a
            },
            rangelength: function (b, d, a) {
                var c = this.getLength($.trim(b), d);
                return this.optional(d) || (c >= a[0] && c <= a[1])
            },
            min: function (b, c, a) {
                return this.optional(c) || b >= a
            },
            max: function (b, c, a) {
                return this.optional(c) || b <= a
            },
            range: function (b, c, a) {
                return this.optional(c) || (b >= a[0] && b <= a[1])
            },
            email: function (a, b) {
                return this.optional(b) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(a)
            },
            url: function (a, b) {
                return this.optional(b) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a)
            },
            date: function (a, b) {
                return this.optional(b) || !/Invalid|NaN/.test(new Date(a))
            },
            dateISO: function (a, b) {
                return this.optional(b) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(a)
            },
            number: function (a, b) {
                return this.optional(b) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(a)
            },
            digits: function (a, b) {
                return this.optional(b) || /^\d+$/.test(a)
            },
            creditcard: function (b, e) {
                if (this.optional(e)) return "dependency-mismatch";
                if (/[^0-9-]+/.test(b)) return false;
                var a = 0,
                    d = 0,
                    bEven = false;
                b = b.replace(/\D/g, "");
                for (var n = b.length - 1; n >= 0; n--) {
                    var c = b.charAt(n);
                    var d = parseInt(c, 10);
                    if (bEven) {
                        if ((d *= 2) > 9) d -= 9
                    }
                    a += d;
                    bEven = !bEven
                }
                return (a % 10) == 0
            },
            accept: function (b, c, a) {
                a = typeof a == "string" ? a.replace(/,/g, '|') : "png|jpe?g|gif";
                return this.optional(c) || b.match(new RegExp(".(" + a + ")$", "i"))
            },
            equalTo: function (c, d, a) {
                var b = $(a).unbind(".validate-equalTo").bind("blur.validate-equalTo", function () {
                    $(d).valid()
                });
                return c == b.val()
            }
        }
    });
    $.format = $.validator.format
})(jQuery);
(function ($) {
    var c = $.ajax;
    var d = {};
    $.ajax = function (a) {
        a = $.extend(a, $.extend({}, $.ajaxSettings, a));
        var b = a.port;
        if (a.mode == "abort") {
            if (d[b]) {
                d[b].abort()
            }
            return (d[b] = c.apply(this, arguments))
        }
        return c.apply(this, arguments)
    }
})(jQuery);
(function ($) {
    if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) {
        $.each({
            focus: 'focusin',
            blur: 'focusout'
        }, function (b, a) {
            $.event.special[a] = {
                setup: function () {
                    this.addEventListener(b, handler, true)
                },
                teardown: function () {
                    this.removeEventListener(b, handler, true)
                },
                handler: function (e) {
                    arguments[0] = $.event.fix(e);
                    arguments[0].type = a;
                    return $.event.handle.apply(this, arguments)
                }
            };

            function handler(e) {
                e = $.event.fix(e);
                e.type = a;
                return $.event.handle.call(this, e)
            }
        })
    };
    $.extend($.fn, {
        validateDelegate: function (d, e, c) {
            return this.bind(e, function (a) {
                var b = $(a.target);
                if (b.is(d)) {
                    return c.apply(b, arguments)
                }
            })
        }
    })
})(jQuery);


