<?php
/*
    "WordPress Plugin Template" Copyright (C) 2018 Michael Simpson  (email : michael.d.simpson@gmail.com)

    This file is part of WordPress Plugin Template for WordPress.

    WordPress Plugin Template is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WordPress Plugin Template is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Contact Form to Database Extension.
    If not, see http://www.gnu.org/licenses/gpl-3.0.html
*/

function WoosharkAmazonImporter_init($file) {

    require_once('WoosharkAmazonImporter_Plugin.php');
    $aPlugin = new WoosharkAmazonImporter_Plugin();

    // Install the plugin
    // NOTE: this file gets run each time you *activate* the plugin.
    // So in WP when you "install" the plugin, all that does it dump its files in the plugin-templates directory
    // but it does not call any of its code.
    // So here, the plugin tracks whether or not it has run its install operation, and we ensure it is run only once
    // on the first activation
    if (!$aPlugin->isInstalled()) {
        $aPlugin->install();
    }
    else {
        // Perform any version-upgrade activities prior to activation (e.g. database changes)
        $aPlugin->upgrade();
    }

    // Add callbacks to hooks
    $aPlugin->addActionsAndFilters();

    if (!$file) {
        $file = __FILE__;
    }
    // Register the Plugin Activation Hook
    register_activation_hook($file, array(&$aPlugin, 'activate'));


    // Register the Plugin Deactivation Hook
    register_deactivation_hook($file, array(&$aPlugin, 'deactivate'));
}



function amazon_getProduct_FROMWP()
{

  $paged = isset($_POST['paged']) ? sanitize_text_field($_POST['paged']) : '';

  $args = array(
    'post_type'      => 'product',
    'posts_per_page' => 20,
    'paged' => $paged,
    'meta_query' => array(
      array(
        'key' => 'productUrl', //meta key name here
        'value' => '.amazon.',
        'compare' => 'LIKE',
      )
    )


  );

  $products = new WP_Query($args);
  $finalList = array();

  if ($products->have_posts()) {
    while ($products->have_posts()) : $products->the_post();
      $theid = get_the_ID();
      $product = new WC_Product($theid);
      if (has_post_thumbnail()) {
        $thumbnail = get_post_thumbnail_id();
        $image = $thumbnail ? wp_get_attachment_url($thumbnail) : '';
      }
      $finalList[] = array(
        sku => $product->get_sku(),
        id => $theid,
        // image => wp_get_attachment_image_src( get_post_thumbnail_id($products->post->ID)),
        image => $image,
        title =>  $product->get_title(),
        productUrl => get_post_meta($theid, 'productUrl', true)

      );
    endwhile;
  } else {
    echo __('No products found');
  }
  wp_reset_postdata();

  wp_send_json($finalList);
}
function amazon_get_categories_FROMWP()
{

  $orderby = 'name';
  $order = 'asc';
  $hide_empty = false;
  $cat_args = array(
    'orderby'    => $orderby,
    'order'      => $order,
    'hide_empty' => $hide_empty,
  );

  $product_categories = get_terms('product_cat', $cat_args);

  // $response['message'] = $post_id->get_error_message();
  wp_send_json($product_categories);
}
function amazon_insertProductInWoocommerce()
{


  $nonce = $_POST['nonce'];

  // if ( ! wp_verify_nonce( $nonce, 'example-ajax-script' ) ) {
  //     die( 'Nonce value cannot be verified.' );
  // }



  // function example_ajax_request()
  // {


  $nonce = $_POST['nonce'];

  // if ( ! wp_verify_nonce( $nonce, 'example-ajax-script' ) ) {
  //     die( 'Nonce value cannot be verified.' );
  // }

  if (isset($_POST)) {
    $sku = isset($_POST['sku']) ? sanitize_text_field($_POST['sku']) : '';
    $images = isset($_POST['images']) ? $_POST['images'] : array();
    $categories = isset($_POST['categories']) ? $_POST['categories'] : array();
    $title = isset($_POST['title']) ? sanitize_text_field($_POST['title']) : '';
    $description = isset($_POST['description']) ? $_POST['description'] : '';
    $productType = isset($_POST['productType']) ? sanitize_text_field($_POST['productType']) : 'simple';
    $regularPrice = isset($_POST['regularPrice']) ? sanitize_text_field($_POST['regularPrice']) : '0';
    $salePrice = isset($_POST['salePrice']) ? sanitize_text_field($_POST['salePrice']) : '0';
    $quantity = isset($_POST['quantity']) ? sanitize_text_field($_POST['quantity']) : '0';
    $postStatus = isset($_POST['postStatus']) ? sanitize_text_field($_POST['postStatus']) : 'draft';
    $variations = isset($_POST['variations']) ? $_POST['variations'] : array();
    $attributes = isset($_POST['attributes']) ? $_POST['attributes'] : array();
    $productUrl = isset($_POST['productUrl']) ? sanitize_text_field($_POST['productUrl']) : '';
    $shortDescription = isset($_POST['shortDescription']) ? sanitize_text_field($_POST['shortDescription']) : '';
    $importVariationImages = isset($_POST['importVariationImages']) ? sanitize_text_field($_POST['importVariationImages']) : '';
    $reviews = isset($_POST['reviews']) ? $_POST['reviews'] : array();



    $allowed_html = array(
      'a' => array(
        'href' => array(),
      ),
      'img' => array(),
    );
    $sanitizedDEscription = html_entity_decode($description);


    if ($productType == 'simple') {
    // if (false) {
      $product = new WC_Product_Simple();
        if (isset($title)) {
          $product->set_name($title);
        }
        if (isset($description)) {
          $product->set_description($description);
        }
        if (isset($shortDescription)) {
          $product->set_short_description($shortDescription);
        }

        if (isset($sku)) {
          $product->set_sku($sku);
        }

        if (isset($postStatus)) {
          $product->set_status($postStatus);
        }
        if (isset($salePrice)) {
          $product->set_price($salePrice);
          $product->set_regular_price($salePrice);
        }

        if (isset($salePrice)) {
          $product->set_sale_price($salePrice);
        }
        
        if (isset($quantity)) {
          $product->set_stock_quantity($quantity);
          $product->set_stock_status('instock');
        }

        //   //categories
        if (is_array($categories) && count($categories)) {
          $product->set_category_ids($categories);
        }
        //images
        

        amazon_save_product_images($product, $images);

        try {
          $post_id = $product->save();
        } catch (Exception $e) {
          $results = array(
            'error' => true,
            'error_msg' => 'Error received when trying to insert the product' . $e->getMessage(),
            'data' => ''
          );
          wp_send_json($results);
        }

        if (isset($productUrl)) {
          update_post_meta($post_id, 'productUrl', $productUrl);
        }

        $results = array(
          'error' => false,
          'error_msg' => '',
          'data' => 'Product inserted successfully'
        );
        wp_send_json($results);


     


    } 
  }
}










add_action('wp_ajax_amazon_wooshark-insert-product', 'amazon_insertProductInWoocommerce');
add_action('wp_ajax_amazon_nopriv_wooshark-insert-product', 'amazon_insertProductInWoocommerce');




add_action('wp_ajax_amazon_get_categories', 'amazon_get_categories_FROMWP');
add_action('wp_ajax_nopriv_amazon_get_categories', 'amazon_get_categories_FROMWP');



add_action('wp_ajax_amazon_get_products', 'amazon_getProduct_FROMWP');
add_action('wp_ajax_amazon_nopriv_get_products', 'amazon_getProduct_FROMWP');




function amazon_getProductsCount()
{

  $args = array(
    'post_type'      => 'product',
    'meta_query' => array(
      array(
        'key' => 'productUrl', //meta key name here
        'value' => '.amazon.',
        'compare' => 'LIKE',
      )
    ),
  );
  $query = new WP_Query($args);
  $total = $query->found_posts;
  wp_reset_postdata();
  wp_send_json($total);
}


add_action('wp_ajax_amazon_getProductsCount', 'amazon_getProductsCount');
add_action('wp_ajax_nopriv_amazon_getProductsCount', 'amazon_getProductsCount');




function amazon_getNewProductDetails()
{
  $productUrl = isset($_POST['productUrl']) ? sanitize_text_field($_POST['productUrl']) : '';
  $currency = isset($_POST['currency']) ? sanitize_text_field($_POST['currency']) : '';

  $finalList = array($productUrl);
  // $finalList = array('https://www.aliexpress.com/item/400232307556232424282.html');

  $curl = curl_init();
  $payload = json_encode(array('productUrls' => $finalList , 'currency' => $currency));
  curl_setopt($curl, CURLOPT_URL, "https://wooshark.website:8002/getVariationsFromApiUsingOUrAliExpressApi");
  curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
  curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  $output = curl_exec($curl);
  $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
  curl_close($curl);

  if (isset($httpcode) && $httpcode == 200) {
    $newVariations = json_decode($output, true);
    wp_send_json($newVariations);

    // $resp = array($output);
    
  } else if(isset($httpcode) && $httpcode == 477){
    $results = array(
      'error' => true,
      'error_msg' => 'product-not-found',
      'data' => ''
    );
    wp_send_json($results);
  
} else if(isset($httpcode) && $httpcode == 499){
  $results = array(
    'error' => true,
    'error_msg' => 'error parsing catched error',
    'data' => ''
  );
  wp_send_json($results);

} else if(isset($httpcode) && $httpcode == 488){
  $results = array(
    'error' => true,
    'error_msg' => 'other error from wooshark server',
    'data' => ''
  );
  wp_send_json($results);
}
else{
  $results = array(
    'error' => true,
    'error_msg' => 'unknow error, please contact wooshark',
    'data' => ''
  );
  wp_send_json($results);
}
}


function amazon_updateProductVariations()
{

  // $attributesVariations = $variation['attributesVariations'];



  $arrayOfError = array();
  $arrayOfSuccess = array();
  $outOfStock = array();

  $updateVariationsOnServer = isset($_POST['updateVariationsOnServer']) ? $_POST['updateVariationsOnServer'] : array();
  // wp_send_json($updateVariationsOnServer);
  if (isset($updateVariationsOnServer) && count($updateVariationsOnServer)) {
    foreach ($updateVariationsOnServer as $product) {

      if (isset($product['variation_id'])) {
        $isUpdateRegularPriceOk = false;
        $isUpdateSalePriceOk = false;
        $isUpdateStockPriceOk = false;

        if (isset($product['salePrice'])) {
          $isUpdateRegularPriceOk = update_post_meta($product['variation_id'], '_sale_price', $product['salePrice']);
        }
        if (isset($product['regularPrice'])) {
          $isUpdateSalePriceOk = update_post_meta($product['variation_id'], '_regular_price', $product['regularPrice']);
        }
        if (isset($product['availQuantity']) &&  $product['availQuantity'] > -1) {
          $isUpdateStockPriceOk = update_post_meta($product['variation_id'], '_stock', $product['availQuantity']);
        }

        if (isset($product['availQuantity']) &&  $product['availQuantity'] == 0) {
          array_push($outOfStock, $product['variation_id']);
        } else {
          array_push($arrayOfSuccess, $product['variation_id']);
        }

        // $isUpdateRegularPriceOk = update_post_meta($product['variation_id'], '_regular_price', '99.99');
        // $isUpdateStockPriceOk = update_post_meta($product['variation_id'], '_stock', '11');
        // wp_send_json(array('isUpdateRegularPriceOk' => $isUpdateRegularPriceOk, 'isUpdateSalePriceOk' => $isUpdateSalePriceOk, 'isUpdateStockPriceOk' => $isUpdateStockPriceOk ));
        // if($isUpdateRegularPriceOk == true ||  $isUpdateSalePriceOk == true || $isUpdateStockPriceOk == true){
        // }else{
        //   array_push($arrayOfSuccess, $product['variation_id']);
        // }
      }
    }
  }
  $results = array(
    'error' => false,
    'error_msg' => '',
    'data' => array('error' => $arrayOfError, 'success' => $arrayOfSuccess, 'outOfStock' => $outOfStock)
  );
  wp_send_json($results);
}
function amazon_getAmazonOldproductDetails()
{
  // $productUrl = 'https://www.aliexpress.com/item/4001024639837.html';
  $post_id = isset($_POST['post_id']) ? sanitize_text_field($_POST['post_id']) : '';


  $product = wc_get_product($post_id);
  // $price = 
  // $quantity = 
  $oldVariations = $product->get_available_variations();


  wp_send_json($oldVariations);
}
add_action('wp_ajax_amazon_update-product-variations', 'amazon_updateProductVariations');
add_action('wp_ajax_nopriv_amazon_update-product-variations', 'amazon_updateProductVariations');










function amazon_updatePriceAndStock(){
$arrayOfSuccess = array();
  $post_id = isset($_POST['post_id']) ? sanitize_text_field($_POST['post_id']) : '';
  $productPrice = isset($_POST['productPrice']) ? sanitize_text_field($_POST['productPrice']) : '';
  $productQuantity = isset($_POST['productQuantity']) ? sanitize_text_field($_POST['productQuantity']) : '';
   update_post_meta($post_id, '_regular_price', '99.99');
   update_post_meta($post_id, '_sale_price', '99.99');
   update_post_meta($post_id, '_stock', '99');
array_push($arrayOfSuccess, 'OK');
  
  $results = array(
    'error' => false,
    'error_msg' => '',
    'data' => array( 'success' => $arrayOfSuccess)
  );
  wp_send_json($results);
}

add_action('wp_ajax_amazon_update-product-price-and-stock', 'amazon_updatePriceAndStock');
add_action('wp_ajax_nopriv_amazon_update-product-price-and-stock', 'amazon_updatePriceAndStock');






add_action('wp_ajax_amazon_get-new-product-details', 'amazon_getNewProductDetails');
add_action('wp_ajax_nopriv_amazon_get-new-product-details', 'amazon_getNewProductDetails');


add_action('wp_ajax_amazon_get-amazon-old-product-details', 'amazon_getAmazonOldproductDetails');
add_action('wp_ajax_nopriv_amazon_get-amazon-old-product-details', 'amazon_getAmazonOldproductDetails');


function amazon_searchProductBySku()
{
  $searchSkuValue = isset($_POST['searchSkuValue']) ? sanitize_text_field($_POST['searchSkuValue']) : '';

  if (isset($searchSkuValue)) {
    $args = array(
      'post_type'      => 'product',
      'posts_per_page' => 1,
      'meta_query' => array(
        array(
          "key" => "_sku",
          "value" => $searchSkuValue,
          "compare" => "LIKE"
        ),
          array(
            'key' => 'productUrl', //meta key name here
            'value' => '.amazon.',
            'compare' => 'LIKE',
          )
        )
    );





    $products = new WP_Query($args);
    $finalList = array();

    if ($products->have_posts()) {
      while ($products->have_posts()) : $products->the_post();
        $theid = get_the_ID();
        $product = new WC_Product($theid);
        if (has_post_thumbnail()) {
          $thumbnail = get_post_thumbnail_id();
          $image = $thumbnail ? wp_get_attachment_url($thumbnail) : '';
        }
        $finalList[] = array(
          sku => $product->get_sku(),
          id => $theid,
          // image => wp_get_attachment_image_src( get_post_thumbnail_id($products->post->ID)),
          image => $image,
          title =>  $product->get_title(),
          productUrl => get_post_meta($theid, 'productUrl', true)

        );
      endwhile;
    } else {
      echo __('No products found');
    }
    wp_reset_postdata();

    wp_send_json($finalList);
  } else {
    $results = array(
      'error' => true,
      'error_msg' => 'cannot find result for the introduced sku value, please make sure the product is imported using wooshark',
      'data' => ''
    );
    wp_send_json($results);
  }
}

add_action('wp_ajax_amazon_search-product-by-sku', 'amazon_searchProductBySku');
add_action('wp_ajax_nopriv_amazon_search-product-by-sku', 'amazon_searchProductBySku');





function amazon_removeProductFromShop()
{
  $post_id = isset($_POST['post_id']) ? sanitize_text_field($_POST['post_id']) : '';
  if (isset($post_id)) {
    $id_remove = wp_delete_post($post_id);
    if ($id_remove != false && isset($id_remove)) {
      $results = array(
        'error' => false,
        'error_msg' => '',
        'data' => 'removed successfully'
      );
      wp_send_json($results);
    } else {
      $results = array(
        'error' => trye,
        'error_msg' => 'error while removing the product',
        'data' => ''
      );
      wp_send_json($results);
    }
  }
}


add_action('wp_ajax_amazon_remove-product-from-wp', 'amazon_removeProductFromShop');
add_action('wp_ajax_nopriv_amazon_remove-product-from-wp', 'amazon_removeProductFromShop');





add_action('wp_ajax_insert-reviews-to-product', 'insertReviewsIntoProduct');
add_action('wp_ajax_nopriv_insert-reviews-to-product', 'insertReviewsIntoProduct');



function amazon_getAlreadyImportedProducts(){
  $listOfSkus = isset($_POST['listOfSkus']) ? ($_POST['listOfSkus']) : array();

  if(isSet($listOfSkus) && count($listOfSkus)){
      $args = array(
        'post_type'      => 'product',
        'posts_per_page' => 40,
        'meta_query' => array(
          array(
            "key" => "_sku",
            "value" => $listOfSkus,
            "compare" => "IN"
          ), array(
            'key' => 'productUrl', //meta key name here
            'value' => '.amazon.',
            'compare' => 'LIKE',
          )
        )
  
  
      );
      $products = new WP_Query($args);
      $finalList = array();
  
      if ($products->have_posts()) {
        while ($products->have_posts()) : $products->the_post();
          $theid = get_the_ID();
          $product = new WC_Product($theid);
          
          $finalList[] = array(
            sku => $product->get_sku(),
            id => $theid,
            title =>  $product->get_title(),
            productUrl => get_post_meta($theid, 'productUrl', true)
    
          );
        endwhile;
      } else {
        echo __('No products found');
      }
      wp_reset_postdata();
    
      wp_send_json($finalList);
    }
}


add_action('wp_ajax_amazon_get-already-imported-products', 'amazon_getAlreadyImportedProducts');
add_action('wp_ajax_nopriv_amazon_get-already-imported-products', 'amazon_getAlreadyImportedProducts');




add_action('wp_ajax_get-sku-and-url-by-Category', 'getSKuAbdUrlByCategory');
add_action('wp_ajax_nopriv_get-sku-and-url-by-Category', 'getSKuAbdUrlByCategory');






// helper 



function amazon_save_product_images($product, $images)
{
    if (is_array($images)) {
        $gallery = array();
        foreach ($images as $key=>$image) {
            //  $attachment_id = isset($image['id']) ? absint($image['id']) : 0;
            if (isset($image)) {
                $upload = wc_rest_upload_image_from_url(esc_url_raw($image));
                if (is_wp_error($upload)) {
                    if (!apply_filters('woocommerce_rest_suppress_image_upload_error', false, $upload, $product->get_id(), $images)) {
                        throw new WC_REST_Exception('woocommerce_product_image_upload_error', $upload->get_error_message(), 400);
                    } else {
                        continue;
                    }
                }
                $attachment_id = wc_rest_set_uploaded_image_as_attachment($upload, $product->get_id());
            }
            //  if (isset($image['position']) && 0 === $image['position']) {
              if($key == 0){
                $product->set_image_id($attachment_id);
              }else{
                array_push($gallery, $attachment_id);
              }
            //  } else {
                //  $gallery[] = $attachment_id;
            //  }
            // Set the image alt if present.
            //  if (!empty($image['alt'])) {
            //      update_post_meta($attachment_id, '_wp_attachment_image_alt', wc_clean($image['alt']));
            //  }
            // Set the image name if present.
            //  if (!empty($image['name'])) {
            //      wp_update_post(array('ID' => $attachment_id, 'post_title' => $image['name']));
            //  }
        }
        if (!empty($gallery)) {
            $product->set_gallery_image_ids($gallery);
        }
    } else {
        $product->set_image_id('');
        $product->set_gallery_image_ids(array());
    }
    return $product;
}
