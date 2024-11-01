var hostname = "https://wooshark.website",
    imagesFromDescription = [],
    items = "",
    globalClientWebsite = "",
    globalClientKey = "",
    globalClientSecretKey = "",
    formsToSave = "",
    savedCategories = [],
    generalPreferences = items ? items.generalPreferences : { importSalePriceGeneral: !1, importDescriptionGeneral: !0, importReviewsGeneral: !0, importVariationsGeneral: !0, reviewsPerPage: 10, setMaximimProductStock: 0, importShippingCost: !1 },
    images = [];

function getProductId(e) { var t = e.indexOf(".html"); return e.substring(0, t).match(/\d+/)[0] }
jQuery(document).on("click", "#goToExtension", function(e) { window.open("https://www.wooshark.com/aliexpress") }), jQuery(document).on("click", "#close-1", function(e) { jQuery("#section-1").hide() }), jQuery(document).on("click", "#close-2", function(e) { jQuery("#section-2").hide() });
var currentSku = "";

function searchProductsAmazon(e) {
    jQuery("#pagination").empty(), jQuery("#pagination").show(), jQuery("#product-search-container").empty();
    var t = jQuery('input[name="language"]:checked')[0] ? jQuery('input[name="language"]:checked')[0].value : "en";
    jQuery(".loader2").css({ display: "block", position: "fixed", "z-index": 9999, top: "50px", right: "50px", "border-radius": "35px", "background-color": "red" }), searchAmazonByKeyword(searchKeyword, t, e)
}
jQuery(document).on("click", ".product-page-item", function(e) { jQuery("#product-pagination").empty(), jQuery("#product-pagination").show(), jQuery(".loader2").css({ display: "block", position: "fixed", "z-index": 9999, top: "50px", right: "50px", "border-radius": "35px", "background-color": "green" }); var t = 1; try { t = parseInt(jQuery(this)[0].innerText), displayPaginationSection(totalproductsCounts, t), getAllAmazonProducts(t) } catch (e) { t = 1, displayToast("error while index selection, please contact wooshark, wooebayimporter@gmail.com", "red"), jQuery(".loader2").css({ display: "none" }) } }), jQuery(document).on("click", ".page-item", function(e) {
    var t = 1;
    try { t = parseInt(jQuery(this)[0].innerText) } catch (e) { t = 1, displayToast("error while index selection, please contact wooshark, wooebayimporter@gmail.com", "red") }
    searchProductsAmazon(t)
});
let globalProduts = [];

function searchAmazonByKeyword(e, t, o) {
    startLoading();
    let r = jQuery("#searchKeyword").val(),
        a = jQuery('input[name="sort"]:checked')[0] ? jQuery('input[name="sort"]:checked')[0].value : "",
        n = jQuery("#highQualityItems").prop("checked");
    xmlhttp = new XMLHttpRequest, xmlhttp.onreadystatechange = function() { if (4 == xmlhttp.readyState && 200 === xmlhttp.status) try { data = JSON.parse(xmlhttp.response).data, console.log(data); try { if ((globalProduts = data.result.products).forEach(function(e) { jQuery('<div class="card text-center" style="flex: 1 1 20%; margin:30px; padding:50px">  <div class="card-body"><h5 class="card-title"> ' + e.productTitle.substring(0, 70) + '</h5><img src="' + e.imageUrl + '" width="150"  height="150"></img><div>Sale Price: <p class="card-text" style="color:red">' + e.salePrice + '</div></p>Sku: <p class="card-text" id="sku" ">' + e.productId + '</p><div><div><a  style="width:100%; margin-top:5px"" id="amazonAddToWaitingList" class=" btn btn-primary">Import to Shop</a></div><div><a id="productUrl" target="_blank" style="width:100%; margin-top:5px" href="' + e.productUrl + '" class="btn btn-primary">Product url</a></div></div></div></div>').appendTo("#product-search-container") }), displayPAginationForSearchByKeyword(data.result.totalResults, o), jQuery(".loader2").css({ display: "none" }), globalProduts && globalProduts.length) getAlreadyImportedProducts(globalProduts.map(function(e) { return e.productId })) } catch (e) { displayToast("Empty result for this search keyword", "red"), jQuery(".loader2").css({ display: "none" }) } } catch (e) { jQuery(".loader2").css({ display: "none" }) } }, xmlhttp.open("POST", hostname + ":8002/searchAmazonProductsFromWooshark", !0), xmlhttp.setRequestHeader("Content-Type", "application/json"), xmlhttp.send(JSON.stringify({ productUrl: "https://www.amazon.com/gp/product/B081LSJ2NC", searchKeyword: r, pageNo: o, language: "en", sort: a, highQualityItems: n, currency: "USD" }))
}

function getProductsCount() { jQuery.ajax({ url: wooshark_params.ajaxurl, type: "POST", dataType: "JSON", data: { action: "amazon_getProductsCount" }, success: function(e) { console.log("----response", e), displayPaginationSection(totalproductsCounts = e, 1) }, error: function(e) { console.log("****err", e), displayToast(e.responseText, "red"), stopLoading() }, complete: function() { console.log("SSMEerr"), stopLoading() } }) }

function displayToast(e, t, o) { jQuery.toast({ text: e, textColor: "black", hideAfter: 7e3, icon: "red" == t ? "error" : "success", stack: 5, textAlign: "left", position: o ? "top-right" : "bottom-right" }) }

function isNotConnected() { jQuery("#not-connected").show(), jQuery("#connected").hide() }
jQuery(document).on("click", "#amazonSeachProductsButton", function(e) { searchProductsAmazon(1) }), jQuery(document).on("click", "#discoverFeatures", function(e) { jQuery("#discoverFeatureContent").is(":hidden") ? jQuery("#discoverFeatureContent").show() : jQuery("#discoverFeatureContent").hide() }), jQuery(document).on("click", "#displayConnectToStore", function(e) { jQuery("#connect-to-store").is(":hidden") ? jQuery("#connect-to-store").show() : jQuery("#connect-to-store").hide() }), jQuery(document).on("click", "#importProductToShopByUrl", function(e) {}), jQuery(document).ready(function() { jQuery('.nav-item a[id="pills-advanced-tab"]').html(jQuery('.nav-item a[id="pills-advanced-tab"]').text() + '<span   class="badge badge-light"> <i class="fas fa-star"></i> </span>'), jQuery("#remaining").text("Imported products: " + localStorage.getItem("totalImportItems") || 1), jQuery("#searchKeyword").val("Samsung"), getProductsCount(), searchAmazonByKeyword("Samsung", "en", 1), getAllAmazonProducts(1) });
var isAuthorizedUser = !1,
    currentProductId = "";
jQuery(".modal").on("hidden.bs.modal", function(e) { jQuery(this).removeData() });
var index = 0;
let totalproductsCounts = 1;

function displayPAginationForSearchByKeyword(e, t) {
    var o = Math.round(e / 40);
    o > 17 && (o = 17);
    for (var r = 1; r < o; r++) r == t ? jQuery(' <li style="color:red" id="page-' + r + '" class="page-item"><a style="color:red" class="page-link">' + r + "</a></li>").appendTo("#pagination") : jQuery(' <li id="page-' + r + '" class="page-item"><a class="page-link">' + r + "</a></li>").appendTo("#pagination")
}

function displayPaginationSection(e, t) {
    let o = Math.ceil(e / 20);
    for (var r = 1; r < o + 1; r++) r == t ? jQuery(' <li style="color:red" id="product-page-' + r + '" class="product-page-item"><a style="color:red" class="page-link">' + r + "</a></li>").appendTo("#product-pagination") : jQuery(' <li id="product-page-' + r + '" class="product-page-item"><a class="page-link">' + r + "</a></li>").appendTo("#product-pagination");
    jQuery('.nav-item a[id="pills-connect-products"]').html('products <span class="badge badge-light">' + e + "</span>")
}

function getAllAmazonProducts(e) {
    jQuery.ajax({
        url: wooshark_params.ajaxurl,
        type: "POST",
        dataType: "JSON",
        data: { action: "amazon_get_products", paged: e },
        success: function(e) {
            if (console.log("----response", e), e) {
                var t = jQuery("#products-wooshark");
                t.find("tbody tr").remove(), e.forEach(function(e, o) {
                    0;
                    t.append("<tr><td ><img width='80px' height='80px' src=" + e.image + "></img></td><td>" + e.sku + "</td><td>" + e.id + "</td> <td>" + e.title.substring(0, 50) + "</td><td><button class='btn btn-primary' ><a style='color:white' href=" + e.productUrl + "  target='_blank'> Original product url </a></button></td><td><button  class='btn btn-success' id='insert-product-reviews' style='width:100%'><a style='color:white'  data-toggle='modal' data-target='#myModalReviews'> Insert Reviews </a></button></td></tr>")
                })
            }
        },
        error: function(e) { console.log("****err", e), stopLoading() },
        complete: function() { console.log("SSMEerr"), stopLoading() }
    })
}

function startLoading(e) { e || (e = "loader2"), jQuery("." + e).css({ display: "block", position: "fixed", "z-index": 9999, top: "50px", right: "50px", "border-radius": "35px", "background-color": "black" }) }

function stopLoading(e) { e || (e = "loader2"), jQuery("." + e).css({ display: "none" }) }

function prepareDataFormat(e, t, o, r) { if (e && e.variations && e.NameValueList && e.variations.length && e.NameValueList.length) return e.NameValueList.forEach(function(e) { e.name && (e.name = e.name.toLowerCase().replace(" ", "-")), e.values = e.value }), e.variations.forEach(function(e) { e.attributesVariations && e.attributesVariations.forEach(function(e) { e.name && (e.name = e.name.toLowerCase().replace(" ", "-")) }), e.regularPrice && jQuery("#bulkIsApplyFormula").prop("checked") && (e.regularPrice = calculateAppliedPrice(e.regularPrice)), e.salePrice && jQuery("#bulkIsApplyFormula").prop("checked") && (e.salePrice = calculateAppliedPrice(e.salePrice)), e.availQuantity = parseInt(e.availQuantity), e.identifier = "" }), e; if (e && e.variations && e.variations.length && 1 == e.variations.length) { return { NameValueList: [{ name: "color", values: ["Standard"], variation: !0, visible: !0 }], variations: [{ SKU: e.variations[0].SKU, regularPrice: e.variations[0].regularPrice, salePrice: e.variations[0].salePrice, availQuantity: e.variations[0].availQuantity, attributesVariations: [{ name: "color", value: "Standard" }] }] } } }

function getCategories(e) { jQuery.ajax({ url: wooshark_params.ajaxurl, type: "POST", dataType: "JSON", data: { action: "amazon_get_categories" }, success: function(t) { console.log("----response", t), savedCategories = t, e() }, error: function(t) { console.log("****err", t), displayToast(t.responseText, "red"), stopLoading(), e() }, complete: function() { console.log("SSMEerr"), stopLoading(), e() } }) }
jQuery(document).on("click", "#searchBySku", function(e) {
    jQuery("#product-pagination").empty(), jQuery(".loader2").css({ display: "block", position: "fixed", "z-index": 9999, top: "50px", right: "50px", "border-radius": "35px", "background-color": "red" });
    let t = jQuery("#skusearchValue").val();
    t ? jQuery.ajax({
        url: wooshark_params.ajaxurl,
        type: "POST",
        dataType: "JSON",
        data: { action: "amazon_search-product-by-sku", searchSkuValue: t },
        success: function(e) {
            if (stopLoading(), e) {
                var t = jQuery("#products-wooshark");
                t.find("tbody tr").remove(), e.forEach(function(e, o) { t.append("<tr><td ><img width='80px' height='80px' src=" + e.image + "></img></td><td>" + e.sku + "</td><td>" + e.id + "</td> <td>" + e.title.substring(0, 50) + "</td><td><button class='btn btn-primary' ><a style='color:white' href=" + e.productUrl + "  target='_blank'> Original product url </a></button></td><td><button class='btn btn-success' id='insert-product-reviews' style='width:100%'><a style='color:white'  data-toggle='modal' data-target='#myModalReviews'> Insert Reviews </a></button></td></tr>") })
            }
        },
        error: function(e) { e && e.responseText && displayToast(e.responseText, "red"), stopLoading() },
        complete: function() { console.log("SSMEerr"), stopLoading() }
    }) : getAllAmazonProducts(1)
});
var quill, quillsArray = [];

function handleServerResponseReviews(e) { 200 === e ? (displayToast("Reviews imported successfully", "black"), jQuery(".loader2").css({ display: "none" })) : (displayToast("Error while inserting the product", "red"), jQuery(".loader2").css({ display: "none" })) }

function importProductGloballyBulkAmazon(e, t, o) { startLoading(), getProductDetailsFromServerBulkAmazon(e, t, o) }

function getAmazonPriceAndQuantity(e, t, o) {
    var r = new XMLHttpRequest;
    r.onreadystatechange = function() {
        if (4 == this.readyState)
            if (200 === this.status) {
                var e = JSON.parse(this.response).data;
                e && (stopLoading(), o({ quantity: e.quantity, salePrice: e.salePrice }))
            } else displayToast("Cannot get product details", "red"), stopLoading()
    }, r.open("POST", hostname + ":8002/getAmazonPriceAndQuantity", !0), r.setRequestHeader("Content-Type", "application/json"), r.send(JSON.stringify({ productUrl: e, sku: t }))
}

function getProductDetailsFromServerBulkAmazon(e, t) {
    var o = jQuery('input[name="language"]:checked')[0] ? jQuery('input[name="language"]:checked')[0].value : "en",
        r = jQuery('input[name="currency"]:checked')[0] ? jQuery('input[name="currency"]:checked')[0].value : "USD",
        a = new XMLHttpRequest;
    a.onreadystatechange = function() {
        var e;
        if (4 == this.readyState)
            if (200 === this.status) {
                if (e = JSON.parse(this.response).data) {
                    var o = [];
                    jQuery(".categories input:checked").each(function() { o.push(jQuery(this).attr("value").trim()) });
                    waitingListProducts = [], stopLoading();
                    e.title;
                    let r = e.description,
                        a = globalProduts.find(function(e) { return e.productId == t });
                    amazonAddToWaitingList({ title: a.productTitle, description: r, images: e.images && e.images.length > 1 ? [e.images[1], e.images[2]] : e.images, productUrl: a.productUrl, productCategoies: [], importSalePrice: !0, simpleSku: a.productId.toString(), featured: !0, mainImage: e.mainImage, quantity: 20, salePrice: parseFloat(a.salePrice.match(/[\d\.]+/)) })
                }
            } else displayToast("Cannot insert product into shop " + (e = JSON.parse(this.response).data), "red"), stopLoading()
    }, a.open("POST", hostname + ":8002/getAmazonProductDetails", !0), a.setRequestHeader("Content-Type", "application/json"), a.send(JSON.stringify({ productUrl: e, sku: t, language: o, isBasicVariationsModuleUsedForModalDisplay: !1, currency: r }))
}

function getHtmlDescription(e) {
    if (e) {
        var t = e.indexOf("window.adminAccountId");
        e = e.substring(0, t)
    }
    imagesFromDescription = jQuery("img"), jQuery("#descriptionContent").html(e);
    quill = new Quill("#editor", {
        modules: {
            toolbar: [
                ["bold", "italic", "underline", "strike"],
                ["blockquote", "code-block"],
                [{ header: 1 }, { header: 2 }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ script: "sub" }, { script: "super" }],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ direction: "rtl" }],
                [{ size: ["small", !1, "large", "huge"] }],
                [{ header: [1, 2, 3, 4, 5, 6, !1] }],
                [{ color: [] }, { background: [] }],
                [{ font: [] }],
                [{ align: [] }],
                ["clean"]
            ]
        },
        theme: "snow"
    })
}

function getAttributes(e) {
    jQuery("#table-attributes tbody tr").remove(), jQuery("#table-variations thead tr").remove(), jQuery("#table-variations tbody tr").remove();
    var t = e.NameValueList;
    attributesNamesArray = t.map(function(e) { return e.name });
    var o = "",
        r = "";
    t && t.length && (t.forEach(function(e) { e.name && (o = "<td>" + e.name + '</td><td style="width:50%" contenteditable><span> ' + e.value + "</span></td>", r = r + '<td  name="' + e.name + '">' + e.name + "</td>"), jQuery("#table-attributes tbody").append(jQuery("<tr>" + o + '<td><button id="removeVariations" class="btn btn-danger">X</btton><td></tr>')) }), jQuery("#table-variations thead").append(jQuery("<tr><td>Image</td>" + r + '<td>quantity</td><td>Price</td><td>Sale price</td><td>Remove</td><td>sku</td><td>Weight</td><td style="display:none"></td></tr>')))
}

function getVariations(e) {
    e && e.length ? (jQuery("#applyPriceFormula").show(), jQuery("#applyPriceFormulaRegularPrice").show(), jQuery("#importSalePricecheckbox").show(), jQuery("#applyCharmPricingConainer").show(), jQuery("#priceContainer").hide(), jQuery("#skuContainer").hide(), jQuery("#productWeightContainer").hide(), jQuery("#productType").text("Variable Product"), jQuery("#no-variations").hide(), e && e.length > 100 && displayToast("This product has more " + e.length + " variations, only the first 100 variations will be imported", "orange"), e.forEach(function(e) {
        var t = "";
        e.attributesVariations.forEach(function(e, o) { e.name && 0 == o && (e.image ? t = t + '<td><img height="50px" width="50px" src="' + e.image + '"></td>' : t += "<td></td>"), t = t + '<td contenteditable name="' + e.name + '">' + e.value + "</td>" });
        var o = e.regularPrice || e.salePrice,
            r = e.salePrice || e.regularPrice,
            a = jQuery("#productWeight").val();
        t = t + "<td contenteditable >" + e.availQuantity + "</td><td contenteditable>" + o + "</td><td contenteditable>" + r + '</td><td><button id="removeVariation" class="btn btn-danger">X</button></td><td contenteditable>' + e.SKU + "</td><td contenteditable>" + a + '</td><td style="display:none">' + e.identifier + "</td>", jQuery("#table-variations tbody").append(jQuery("<tr>" + t + "</tr>")), jQuery("#table-variations tr td[contenteditable]").css({ border: "1px solid #51a7e8", "box-shadow": "inset 0 1px 2px rgba(0,0,0,0.075), 0 0 5px rgba(81,167,232,0.5)" })
    }), applyPriceFormulaDefault()) : (jQuery('[href="#menu5"]').closest("li").hide(), jQuery("#no-variations").show(), jQuery("#applyPriceFormula").hide(), jQuery("#applyPriceFormulaRegularPrice").hide(), jQuery("#importSalePricecheckbox").hide(), jQuery("#applyCharmPricingConainer").hide(), jQuery("#priceContainer").show(), jQuery("#skuContainer").show(), jQuery("#productType").text("Simple Product"))
}

function getImagesModal(e) { images = e, e.forEach(function(e) { jQuery('<div><button type="button" class="btn btn-primary" id="removeImage" ><i style="font-size:15px ; margin:5px">Remove Image</i></button><img  src=' + e + " /><div>").appendTo(jQuery("#galleryPicture")) }) }

function getAttributesVariations(e, t) { for (var o = [], r = e.split(","), a = 0; a < r.length; a++) t.forEach(function(e) { e.skuPropertyValues.forEach(function(t) { r[a] == t.propertyValueId && o.push({ name: e.skuPropertyName, value: t.propertyValueDisplayName, image: t.skuPropertyImagePath }) }) }); return o }

function fakeGetAttributesVariations(e) { var t = []; return e.forEach(function(e) { e.skuPropertyValues.forEach(function(o) { t.push({ name: e.skuPropertyName, value: o.propertyValueDisplayName, image: o.skuPropertyImagePath }) }) }), t }

function buildNameListValues(e) {
    var t = [];
    return e.forEach(function(e, o) {
        var r = getAttrValues(e);
        r && r.length && t.push({ name: e.skuPropertyName, value: r })
    }), t
}

function getAttrValues(e) { var t = []; return e.skuPropertyValues.forEach(function(e) { t.push(e.propertyValueDisplayName) }), console.log("values", t), t }

function getProductReviews() {
    var e = jQuery("#customReviews tr"),
        t = [];
    return e && e.length ? (e.each(function(e, o) { e && t.push({ review: o.cells[0].innerHTML || "-", rating: jQuery(o).find("input").val() || 5, datecreation: o.cells[2].outerText, username: o.cells[1].outerText || "unknown", email: "test@test.com" }) }), t) : []
}

function resetTheForm() { jQuery("#customProductTitle").val(""), jQuery("#shortDescription").val(""), jQuery("#customPrice").val(""), jQuery("#customSalePrice").val(""), jQuery("#simpleSku").val(""), jQuery("#customProductCategory input:checked").each(function() { jQuery(this).prop("checked", !0) }), jQuery("#table-attributes tr").remove(), jQuery("#customProductCategory").empty(), jQuery("#galleryPicture").empty(), jQuery("#table-variations tr").remove() }

function getPRoductUrlFRomSku(e) {
    var t = "";
    if (e) {
        var o = jQuery('input[name="language"]:checked')[0] ? jQuery('input[name="language"]:checked')[0].value : "en";
        t = "en" == o ? "https://aliexpress.com/item/" + e + ".html" : "https://" + o + ".aliexpress.com/item/" + e + ".html"
    }
    return t
}

function buildVariations() {
    var e = { variations: [], NameValueList: [] };
    jQuery("#table-attributes tr").each(function(t, o) { t && e.NameValueList.push({ name: o.cells[0].textContent.toLowerCase().replace(" ", "-"), values: o.cells[1].textContent.split(","), variation: !0, visible: !0 }) });
    var t = e.NameValueList.length;
    return jQuery("#table-variations tr").each(function(o, r) {
        if (o && o < 100) {
            var a = [];
            e.NameValueList.forEach(function(e, t) { a.push({ name: e.name.toLowerCase().replace(" ", "-"), value: r.cells[t + 1].textContent.trim(), image: r.cells[0] && r.cells[0].children && r.cells[0].children[0] && r.cells[0].children[0].currentSrc ? r.cells[0].children[0].currentSrc : "" }) }), r.cells[t + 1].textContent && e.variations.push({ SKU: r.cells[t + 5].textContent, availQuantity: r.cells[t + 1].textContent || 1, salePrice: r.cells[t + 3].textContent, regularPrice: r.cells[t + 2].textContent, attributesVariations: a, weight: r.cells[t + 6].textContent || jQuery("#productWeight").val() })
        }
    }), e
}
jQuery(document).on("click", "#importToShop", function(e) {}), jQuery(document).on("click", "#importAllProductOnThisPage", function(e) {
    if ("false" != localStorage.getItem("_isAuthorized")) {
        let e = jQuery("#product-search-container .card");
        startLoading("loader3");
        for (var t = 0; t < e.length; t++) ! function(t) {
            window.setTimeout(function() {
                console.log("------------------11");
                let o = jQuery(e[t]).find("#sku")[0].innerText,
                    r = jQuery(e[t]).find("#productUrl")[0].href;
                o ? importProductGloballyBulkAmazon(r, o, !0) : displayToast("Cannot get product sku", "red")
            }, 2e3 * t)
        }(t)
    } else displayToast("please activate your account", "red")
}), jQuery(document).on("click", "#updateCurrentPage", function(e) {
    let t = jQuery("#products-wooshark tbody tr"),
        o = [];
    t.each(function(e, t) { o.push({ id: t.cells[2].innerText, sku: t.cells[1].innerText, productUrl: t.cells[4].lastChild.lastElementChild.href }) });
    let r = o.length;
    logStartUpdateInit(5 * r, r);
    for (var a = 0; a < o.length; a++) ! function(e) { window.setTimeout(function() { StartUpdateProcess(o[e].id, o[e].sku, o[e].productUrl, !0) }, 5e3 * e) }(a)
}), jQuery(document).on("click", "#removePicture", function(e) {
    if (jQuery("#removePicture")[0].checked) {
        htmlEditor = quill.root.innerHTML;
        var t = htmlEditor.replace(/<img[^>]*>/g, "");
        t = t.replace(/<a[^>]*>/g, ""), quill.setContents([]), quill.clipboard.dangerouslyPasteHTML(0, t)
    } else quill.setContents([]), quill.clipboard.dangerouslyPasteHTML(0, htmlEditor)
}), jQuery(document).on("click", "#displayAdvancedVariations", function(e) { jQuery("#table-attributes").show() }), jQuery(document).on("click", "#addSpecific", function(e) { jQuery("#table-specific tbody").append('<tr><td style="width:50%" contenteditable>    </td><td contenteditable style="width:50%"></td><td><button id="removeAttribute" class="btn btn-danger">X</btton></td></tr>'), jQuery("#table-specific tr td[contenteditable]").css({ border: "1px solid #51a7e8", "box-shadow": "inset 0 1px 2px rgba(0,0,0,0.075), 0 0 5px rgba(81,167,232,0.5)" }) }), jQuery(document).on("click", "#totoButton", function(e) {
    startLoading();
    var t = [];
    let o = "";
    var r = buildVariations(),
        a = jQuery("#customProductTitle").val() || jQuery("head").find("title").text(),
        n = jQuery("#shortDescription").val() || "",
        i = jQuery("#customPrice").val() || "",
        s = jQuery("#customSalePrice").val() || "";
    jQuery("#simpleSku").val();
    let l = [];
    jQuery("#customProductCategory input:checked").each(function() { l.push(jQuery(this).attr("value")) });
    var u = jQuery("#isFeatured")[0].checked,
        c = r.NameValueList;
    let d = getPRoductUrlFRomSku(currentSku);
    jQuery('input[name="categoryChoice"]:checked')[0] && jQuery('input[name="categoryChoice"]:checked')[0].value;
    let p = !1;
    jQuery("#isImportReviewsSingleImport").prop("checked") && (t = getProductReviews()), jQuery("#isImportProductDescriptionSingleImport").prop("checked") && (o = quill.root.innerHTML), jQuery("#isImportProductSpecificationSingleImport").prop("checked") && (r = getItemSpecificfromTable(r));
    var y = (p = !!jQuery("#isPublishProductSingleImport").prop("checked")) ? "publish" : "draft";
    jQuery.ajax({ url: wooshark_params.ajaxurl, type: "POST", dataType: "JSON", data: { action: "amazon_wooshark-insert-product", sku: currentSku.toString(), title: a, description: o || "", productType: "variable", images: images || [], categories: l, regularPrice: i.toString(), salePrice: s.toString(), quantity: 33, attributes: c && c.length ? c : [], variations: r.variations && r.variations.length ? r.variations : [], isFeatured: u, postStatus: y, shortDescription: n || "", productUrl: d, importVariationImages: jQuery("#bulkIsPublish").prop("checked"), reviews: t }, success: function(e) { e && e.error && e.error_msg && displayToast(e.error_msg, "red"), e && !e.error && e.data && displayToast(e.data, "green"), stopLoading() }, error: function(e) { console.log("****err", e), stopLoading(), e && e.responseText && displayToast(e.responseText, "red") } })
}), jQuery(document).on("click", "#importProductToShopBySky", function(e) {}), jQuery(document).on("click", "#amazonAddToWaitingList", function(e) {
    let t = jQuery(this).parents(".card").find("#productUrl")[0].href,
        o = jQuery(this).parents(".card").find("#sku")[0].innerText;
    t ? importProductGloballyBulkAmazon(t, o, !0) : displayToast("Cannot get product sku", "red")
}), jQuery(document).on("click", "#emptyWaitingListProduct", function(e) { jQuery("#emptyWaitingListProduct").remove(), jQuery("#importProductInWaitingListToShop").remove(), globalWaitingList = [] });
var globalWaitingList = [];

function amazonAddToWaitingList(e) { globalWaitingList.push(e), jQuery("#importProductInWaitingListToShop").remove(), jQuery("#emptyWaitingListProduct").remove(), jQuery('<button type="button" id="importProductInWaitingListToShop" style=" position:fixed; border-raduis:0px; right: 1%; bottom: 60px; width:15%;z-index:9999" class="waitingListClass btn btn-primary btn-lg"><i class="fa fa-files-o fa-3px"> Import waiting List <span class="badge">' + globalWaitingList.length + "</span></i></button>").appendTo(jQuery("html")), jQuery('<button type="button" id="emptyWaitingListProduct" style=" position:fixed; border-raduis:0px; bottom: 10px; right: 1%;  width:15%;z-index:9999" class="waitingListClass btn btn-danger btn-lg"><i class="fa fa-files-o fa-3px">  Reset Waiting list </span></i></button>').appendTo(jQuery("html")) }

function getAlreadyImportedProducts(e) {
    jQuery.ajax({
        url: wooshark_params.ajaxurl,
        type: "POST",
        dataType: "JSON",
        data: { action: "amazon_get-already-imported-products", listOfSkus: e },
        success: function(e) {
            let t = e;
            t && t.length && displayAlreadyImportedIcon(t), console.log("****response", e)
        },
        error: function(e) { e.responseText, console.log("****err", e), stopLoading() },
        complete: function() { console.log("SSMEerr"), stopLoading() }
    })
}

function displayAlreadyImportedIcon(e) {
    if (e && e.length) {
        let o = e.map(function(e) { return e.sku }),
            r = jQuery("#product-search-container .card");
        for (var t = 0; t < r.length; t++) { let e = jQuery(r[t]).find("#sku")[0].innerText; if (o.indexOf(e) > -1) { jQuery('<div><a  style="width:100%" id="alreadyImported" class=" btn btn-warning">Already imported</a></div>').appendTo(jQuery(r[t])) } }
    }
}

function handleError(e) { stopLoading(), e && e.error && e.error_msg && displayToast(e.error_msg, "red"), e && !e.error && e.data && displayToast(e.data, "green") }

function startLoadingText() { jQuery('<h3  id="loading-variation" style="color:green;">  Loading .... </h3>').appendTo(".log-sync-product") }

function stopLoadingText() { jQuery("#loading-variation").remove() }

function logStartGettingPRoductDetails(e, t) { e || jQuery(".log-sync-product").empty(), e || (jQuery('<h3 style="color:green;"> ID: ' + t + " 1-  Getting existing Product variations .... </h3>").appendTo(".log-sync-product"), startLoadingText()) }

function logStartCallingServerToUpdateAlreadyMatchedVariations(e, t, o) { e ? jQuery('<h3 style="color:green;"> ID: ' + t.id + " 1-  Update variations Start .. " + o.length + " variations will be updated</h3>").appendTo(".log-sync-product") : jQuery('<h3 style="color:green;"> ID: ' + t.id + " 5-  Update variations Start .. " + o.length + " variations will be updated</h3>").appendTo(".log-sync-product") }

function logCouldNotMatchAnyOldVariationWithAnyNewVariation(e, t) { e ? jQuery('<h3 style="color:green;"> ID: ' + t.id + " 1-  No variations to update ...</h3>").appendTo(".log-sync-product") : jQuery('<h3 style="color:green;"> ID: ' + t.id + " 5-  No variations to update ...</h3>").appendTo(".log-sync-product"), stopLoading() }

function logCannotFinfProductWithTheSkuFromTheListOfalreadyResolvedOldVariations(e) { e ? jQuery('<h3 style="color:green;"> ID:  1-  No variations to update ...</h3>').appendTo(".log-sync-product") : jQuery('<h3 style="color:green;"> ID: 5-  No variations to update ...</h3>').appendTo(".log-sync-product") }

function logCannotFindVariationsOfExistingProduct(e) { jQuery('<h3 style="color:red;"> ID: ' + e + " 2- Could not find variations, please verify that the produdct is not out of stock </h3>").appendTo(".log-sync-product"), jQuery('<h3 style="color:red;"> ID: ' + e + " 3- Update done with status failure </h3>").appendTo(".log-sync-product"), jQuery('<button id="remove-product-from-wp" idOfPRoductToRemove="' + e + '" class="btn btn-danger" style="margin-top:10px;"> Remove product from your shop </button >').appendTo(".log-sync-product"), stopLoading() }

function logProductNotFound(e, t) { jQuery('<h3 style="color:green;"> ID: ' + e + " 4-  Cannot retrieve new product variations - It seems that the product does not exist anymore on AliExpress, please check if it is still available otehrwise remove it</h3>").appendTo(".log-sync-product"), jQuery('<button  class="btn btn-danger" style="margin-top:10px; margin-right:5px" ><a href="' + t + '" target="_blank">Open product page on Aliexpress</a>  </button >').appendTo(".log-sync-product"), jQuery('<button id="remove-product-from-wp" idOfPRoductToRemove="' + e + '" class="btn btn-danger" style="margin-top:10px;"> Remove product from your shop </button >').appendTo(".log-sync-product") }

function logUnknownError(e, t) { jQuery('<h3 style="color:green;"> ID: ' + e + " 4-  Cannot retrieve new product variations - please retry again if the issue persist, please contact wooshark or try to remove manually the product and isnert it again/h3>").appendTo(".log-sync-product"), jQuery('<button  class="btn btn-danger" style="margin-top:10px; margin-right:5px" ><a href="' + t + '" target="_blank">Open product page on Aliexpress</a>  </button >').appendTo(".log-sync-product"), jQuery('<button id="remove-product-from-wp" idOfPRoductToRemove="' + e + '" class="btn btn-danger" style="margin-top:10px;"> Remove product from your shop </button >').appendTo(".log-sync-product") }

function logStartUpdateInit(e, t) { jQuery(".log-sync-product").empty(), jQuery('<h3 style="color:orange;">   Estimated Time to finish: ' + Math.ceil(e / 60) + " minutes  - Number of products to update:  " + t + "   </h3>").appendTo(".log-sync-product") }

function startLoadingText() { jQuery('<h3  id="loading-variation" style="color:green;">  Loading .... </h3>').appendTo(".log-sync-product") }

function stopLoadingText() { jQuery("#loading-variation").remove() }
indexStopLoading = 0, jQuery(document).on("click", "#importProductInWaitingListToShop", function(e) {
    startLoading(), jQuery("#emptyWaitingListProduct").remove(), jQuery("#importProductInWaitingListToShop").remove(), globalWaitingList.forEach(function(e, t) {
        var o = { title: e.title, description: e.description, images: e.images, variations: [], prductUrl: e.productUrl, mainImage: e.mainImage, simpleSku: e.simpleSku, productType: "variable", attributes: [], shortDescription: "", isFeatured: !0, postStatus: !0, postStatus: "publish" };
        jQuery.ajax({ url: wooshark_params.ajaxurl, type: "POST", dataType: "JSON", data: { action: "amazon_wooshark-insert-product", sku: o.simpleSku.toString(), title: o.title, description: o.description || "", productType: "simple", mainImage: o.mainImage, images: o.images || [], attributes: o.attributes, variations: o.variations, postStatus: o.postStatus, shortDescription: o.shortDescription || "", productUrl: e.productUrl, categories: [], isFeatured: !1, isPublish: !1, quantity: e.quantity, salePrice: e.salePrice }, success: function(e) { e && e.error && e.error_msg && displayToast(e.error_msg, "red"), e && !e.error && e.data && displayToast(e.data, "green") }, error: function(e) { console.log("****err", e), e && displayToast("error while inserting products, please retry", "red") }, complete: function() { console.log("SSMEerr"), indexStopLoading++, indexStopLoading == globalWaitingList.length && (stopLoading(), globalWaitingList = []) } })
    })
}), jQuery(document).on("click", "#resetFormula", function(e) { localStorage.setItem("formsToSave", ""), restoreFormula() }), jQuery(document).on("click", "#addInterval", function(e) { jQuery("#formula").append('<label style="color:red">Price between</label><label style="color:red; float: right;">Formula to apply</label><form style="display: flex"><label style="font-size: 30px">$</label><input style="flex:1 1 15%; margin: 5px" class="form-control" name="min" placeholder="Min price"><label style="flex:1 1 10%; margin: 5px; text-align: center; font-size: 25px">-</label><label style="font-size: 30px">$</label><input style="flex:1 1 15%; margin: 5px" class="form-control"  name="max" placeholder="Max price"><label style="flex:1 1 20%" for="multiply"> </label> <label style="padding: 8px" for="multiply"> <label style="color:red; font-size: 17px">(*)</label>  </label> <input style="flex:1 1 30%" class="multiply form-control"  name="multiply" placeholder="example: 2 * 2.88 * 0.99"> <label style="padding: 8px" for="addition"> <label style="color:red; font-size: 17px">(+)</label> </label> <input style="flex:1 1 30%" class="addition form-control" type="number" name="addition" placeholder="Add number"> </form>') }), jQuery(document).on("click", "#saveFormula", function(e) {
    var t = jQuery("form"),
        o = [];
    t.each(function(e, t) { t[4] || t[0].value && t[0].value && o.push({ min: t[0].value, max: t[1].value, multiply: t[2] ? t[2].value ? t[2].value.replace(/,/g, ".") : t[2].value : 1, addition: t[3] ? t[3].value ? t[3].value.replace(/,/g, ".") : t[3].value : 0 }) }), o && o.length && (jQuery("#reload").css({ display: "block" }), jQuery("#empty").css({ display: "none" }), localStorage.setItem("formsToSave", JSON.stringify(o)))
}), jQuery(document).on("click", "#sync-product-stock-and-price", function(e) {
    let t = jQuery(this).parents("tr")[0].cells[2].innerText,
        o = jQuery(this).parents("tr")[0].cells[1].innerText,
        r = jQuery(this).parents("tr")[0].cells[4].lastChild.lastElementChild.href;
    startLoading(), logStartUpdateInit("6", 1), logGetNewProductDetails(currentProductId, currentSku, !1), StartUpdateProcess(t, o, r, !1)
});
let productDetailsOldVariationsAndNewVariations = [];

function logStartGettingPRoductDetails(e, t) { e || jQuery(".log-sync-product").empty(), e || (jQuery('<h3 style="color:green;"> ID: ' + t + " 1-  Getting existing Product variations .... </h3>").appendTo(".log-sync-product"), startLoadingText()) }

function logGetNewProductDetails(e, t, o) { o || jQuery('<h3 style="color:green;"> ID: ' + e + " - ASIN: " + t + " Getting new price and stock </h3>").appendTo(".log-sync-product") }

function logNewPriceNEwStock(e, t, o, r, a) { r && a ? jQuery('<h3 style="color:green;"> ID: ' + t + " - ASIN: " + o + " New product Price: " + r + " - quantity: " + a + " </h3>").appendTo(".log-sync-product") : jQuery('<h3 style="color:red;"> ID: ' + t + " - ASIN: " + o + " Cannot get product price and quantity </h3>").appendTo(".log-sync-product") }

function updateProductPriceAndStock(e, t, o, r) { jQuery.ajax({ url: wooshark_params.ajaxurl, type: "POST", dataType: "JSON", data: { action: "amazon_update-product-price-and-stock", post_id: t, productPrice: o, quantity: r }, success: function(o) { stopLoadingText(), o.data && o.data.success && o.data.success.length && (e ? jQuery('<h3 style="color:green;"> ID: ' + currentProductId + "  SUCCESS:  " + o.data.success.length + " product updated successfully </h3>").appendTo(".log-sync-product") : jQuery('<h3 style="color:green;"> ID: ' + currentProductId + " - ASIN: " + t + "  SUCCESS:  " + o.data.success.length + " product updated successfully </h3>").appendTo(".log-sync-product")) }, error: function(e) { jQuery('<h3 style="color:red;"> ID: ' + currentProductId + " 6-  Unknown error </h3>").appendTo(".log-sync-product"), stopLoading() }, complete: function() { console.log("SSMEerr"), stopLoading() } }) }

function StartUpdateProcess(e, t, o, r) {
    getAmazonPriceAndQuantity(o, t, function(o) {
        if (o) {
            console.log("-----data-", o);
            let a = o.salePrice,
                n = o.quantity;
            logNewPriceNEwStock(r, e, t, a, n), a && n ? updateProductPriceAndStock(r, t, a, n) : jQuery('<h3 style="color:red;"> ID: ' + e + "  ERROR:  Error while updating product </h3>").appendTo(".log-sync-product")
        }
    })
}

function logStartCallingServerToUpdateAlreadyMatchedVariations(e, t, o) { e ? jQuery('<h3 style="color:green;"> ID: ' + t.id + " 1-  Update variations Start .. " + o.length + " variations will be updated</h3>").appendTo(".log-sync-product") : jQuery('<h3 style="color:green;"> ID: ' + t.id + " 5-  Update variations Start .. " + o.length + " variations will be updated</h3>").appendTo(".log-sync-product") }

function logCouldNotMatchAnyOldVariationWithAnyNewVariation(e, t) { e ? jQuery('<h3 style="color:green;"> ID: ' + t.id + " 1-  No variations to update ...</h3>").appendTo(".log-sync-product") : jQuery('<h3 style="color:green;"> ID: ' + t.id + " 5-  No variations to update ...</h3>").appendTo(".log-sync-product"), stopLoading() }

function logCannotFinfProductWithTheSkuFromTheListOfalreadyResolvedOldVariations(e) { e ? jQuery('<h3 style="color:green;"> ID:  1-  No variations to update ...</h3>').appendTo(".log-sync-product") : jQuery('<h3 style="color:green;"> ID: 5-  No variations to update ...</h3>').appendTo(".log-sync-product") }

function logCannotFindVariationsOfExistingProduct(e) { jQuery('<h3 style="color:red;"> ID: ' + e + " 2- Could not find variations, please verify that the produdct is not out of stock </h3>").appendTo(".log-sync-product"), jQuery('<h3 style="color:red;"> ID: ' + e + " 3- Update done with status failure </h3>").appendTo(".log-sync-product"), jQuery('<button id="remove-product-from-wp" idOfPRoductToRemove="' + e + '" class="btn btn-danger" style="margin-top:10px;"> Remove product from your shop </button >').appendTo(".log-sync-product"), stopLoading() }

function logProductNotFound(e, t) { jQuery('<h3 style="color:green;"> ID: ' + e + " 4-  Cannot retrieve new product variations - It seems that the product does not exist anymore on AliExpress, please check if it is still available otehrwise remove it</h3>").appendTo(".log-sync-product"), jQuery('<button  class="btn btn-danger" style="margin-top:10px; margin-right:5px" ><a href="' + t + '" target="_blank">Open product page on Aliexpress</a>  </button >').appendTo(".log-sync-product"), jQuery('<button id="remove-product-from-wp" idOfPRoductToRemove="' + e + '" class="btn btn-danger" style="margin-top:10px;"> Remove product from your shop </button >').appendTo(".log-sync-product") }

function logUnknownError(e, t) { jQuery('<h3 style="color:green;"> ID: ' + e + " 4-  Cannot retrieve new product variations - please retry again if the issue persist, please contact wooshark or try to remove manually the product and isnert it again/h3>").appendTo(".log-sync-product"), jQuery('<button  class="btn btn-danger" style="margin-top:10px; margin-right:5px" ><a href="' + t + '" target="_blank">Open product page on Aliexpress</a>  </button >').appendTo(".log-sync-product"), jQuery('<button id="remove-product-from-wp" idOfPRoductToRemove="' + e + '" class="btn btn-danger" style="margin-top:10px;"> Remove product from your shop </button >').appendTo(".log-sync-product") }

function getNewProductDEtails(e, t) {
    jQuery('input[name="language"]:checked')[0] && jQuery('input[name="language"]:checked')[0].value;
    var o = jQuery('input[name="currency"]:checked')[0] ? jQuery('input[name="currency"]:checked')[0].value : "USD",
        r = new XMLHttpRequest;
    r.onreadystatechange = function() {
        var e;
        if (4 == this.readyState)
            if (200 === this.status)(e = JSON.parse(this.response)) && t({ data: e });
            else if (e = JSON.parse(this.response)) {
            let o = e.data;
            t({ error: o })
        }
    }, r.open("POST", hostname + ":8002/getVariationsFromApiUsingOUrAliExpressApi", !0), r.setRequestHeader("Content-Type", "application/json"), r.send(JSON.stringify({ productUrls: [e], currency: o }))
}