<script setup lang="ts">
import placeholderImage from '@/assets/images/online-shopping.png';
import {storeToRefs} from "pinia";
import router from "@/router";
import {useCart} from "@/stores/cart";
import {useDeviceDetector} from "@/compositions/useDevice";
import type {ICartItem} from "@/modal/ICart";
import {useUser} from "@/stores/user";
import {onMounted, onUnmounted, ref, reactive, computed, watch} from "vue";
import type {IUser} from "@/modal/IUser";
import {EDelivery, EInvoice, EPayment, EPersonalInvoice} from "@/enum/Enums";

const deviceDetector = useDeviceDetector();
const userStore = useUser();
const cartStore = useCart();
const isMobile = ref(deviceDetector.mobile);
const {isLogin, user} = storeToRefs(userStore);

interface IInvoice {
  type: number,
  value: {
    type: number,
    value: string,
  },
}

interface IDelivery {
  type: number,
  address: string,
  cost: number,
}

interface IRecipient {
  name: string,
  phone: string,
}

interface ICheckout {
  products: ICartItem[];
  totalPrice: number,
  totalQuantity: number,
  payment: number,
  invoice: IInvoice,
  delivery: IDelivery,
  recipient: IRecipient,
  member: IUser,
}

const {cart} = storeToRefs(cartStore);

onMounted(
    () => {
      if (!isLogin.value) {
        router.push({name: 'login'});
      }

      if (cart.value.length === 0) {
        router.replace({name: 'cart'});
      }
    }
)


const checkout: ICheckout = reactive({
  products: cart.value,
  totalPrice: 0,
  totalQuantity: cart.value.length,
  payment: 0,
  invoice: {
    type: 0,
    value: {
      type: 0,
      value: '',
    },
  },
  delivery: {
    type: 0,
    address: '',
    cost: 0,
  },
  recipient: {
    name: '',
    phone: '',
  },
  member: user.value,
});

watch(() => checkout.delivery.type, (newVal) => {
  checkout.delivery.cost = newVal === EDelivery.Home ? 120 : 60;
});

const totalPrice = computed(() => {
  const productPrice = checkout.products.reduce((pre: number, cur: ICartItem) => {
    return pre + cur.price * cur.quantity;
  }, 0);

  const deliveryPrice = checkout.delivery.cost;
  return productPrice + deliveryPrice;
});

const valid = () => {
  const validResult = {
    products: {status: false, message: ''},
    payment: {status: false, message: ''},
    invoice: {status: false, message: ''},
    delivery: {status: false, message: ''},
    recipient: {status: false, message: ''},
  }

  if (!checkout.products.length
      || checkout.products.filter(item => item.quantity <= 0).length
      || checkout.products.filter(item => !item.onSell).length) {
    validResult.products.status = true;
    validResult.products.message = '沒有可結帳的商品'
  }

  if (!checkout.payment) {
    validResult.payment.status = true;
    validResult.payment.message = '請選擇付款方式'
  }

  if (!checkout.invoice.type) {
    validResult.invoice.status = true;
    validResult.invoice.message = '請選擇發票類型'
  } else if (!checkout.invoice.value.value) {
    validResult.invoice.status = true;
    validResult.invoice.message = '請輸入發票詳細資料'
  }

  if (!checkout.delivery.type) {
    validResult.delivery.status = true;
    validResult.delivery.message = '請選擇取貨方式'
  } else if (checkout.delivery.type === EDelivery.ConvenienceStore && !checkout.delivery.address) {
    validResult.delivery.status = true;
    validResult.delivery.message = '請輸入取貨門市'
  } else if (checkout.delivery.type === EDelivery.Home && !checkout.delivery.address) {
    validResult.delivery.status = true;
    validResult.delivery.message = '請輸入收件地址'
  }

  if (!checkout.recipient.name) {
    validResult.recipient.status = true;
    validResult.recipient.message = '請輸入收件人姓名'
  } else if (!checkout.recipient.phone) {
    validResult.recipient.status = true;
    validResult.recipient.message = '請輸入收件人電話'
  }

  return {
    result: validResult,
    isValid: !Object.values(validResult).some(item => item.status),
  };
}

const checkOrder = () => {
  console.log('checkout');
  checkout.totalPrice = totalPrice.value;
  const {result, isValid} = valid();
  if (!isValid) {
    console.log(result);
    return;
  }
  router.push({name: 'checkoutResult'});
}

</script>

<template>
  <div class="checkout">
    <div class="checkout__list mb-3 bg-gray-200">
      <div class="flex px-6 py-2 items-center cartItem">
        <div class="flex-1 flex items-center">
          <div class="w-20 flex-none mr-10" :class="{'mr-0' : isMobile}">
          </div>
          <div class="w-full">
            商品
          </div>
          <div class="w-full">
            單價
          </div>
          <div class="w-full">
            數量
          </div>
          <div class="w-full">
            總價
          </div>
        </div>
      </div>
      <div class="flex px-6 py-4 items-center cartItem" v-for="cartItem in cart" :key="cartItem.productId">
        <div class="w-20 h-20 flex-none mr-10" :class="{'mr-0' : isMobile}">
          <img :src="cartItem.image?cartItem.image:placeholderImage" alt="" class="w-full h-full">
        </div>
        <div class="flex-1 flex items-center">
          <div class="w-full">
            {{ cartItem.name }}
          </div>
          <div class="w-full">
            ${{ cartItem.price }}
          </div>
          <div class="w-full">
            {{ cartItem.quantity }}
          </div>
          <div class="w-full">
            ${{ cartItem.price * cartItem.quantity }}
          </div>
        </div>
      </div>
    </div>
    <div class="checkout__detail px-6 bg-gray-200">
      <form>
        <div class="checkout__item checkout__item--payment pb-3">
          <div class="checkout__title text-lg -mx-6">
            付款方式
          </div>
          <div class="checkout__content flex py-6">
            <div class="payment__item mr-4">
              <input v-model="checkout.payment"
                     :value="EPayment.CreditCard"
                     type="radio"
                     name="payment"
                     id="PaymentCreditCard">
              <label class="text-base" for="PaymentCreditCard">信用卡</label>
            </div>
            <div class="payment__item">
              <input v-model="checkout.payment"
                     :value="EPayment.Cash"
                     type="radio"
                     name="payment"
                     id="PaymentCash">
              <label class="text-base" for="PaymentCash">貨到付款</label>
            </div>
          </div>
        </div>
        <div class="checkout__item checkout__item--invoice pb-3">
          <div class="checkout__title text-lg -mx-6">
            發票
          </div>
          <div class="checkout__content py-6">
            <div class="flex">
              <div class="invoice__item mr-4">
                <input v-model="checkout.invoice.type"
                       :value="EInvoice.Personal"
                       type="radio"
                       name="Invoice"
                       id="InvoicePersonal">
                <label class="text-base" for="InvoicePersonal">個人發票</label>
              </div>
              <div class="invoice__item">
                <input v-model="checkout.invoice.type"
                       :value="EInvoice.Company"
                       type="radio"
                       name="Invoice"
                       id="InvoiceCompany">
                <label class="text-base" for="InvoiceCompany">公司統編</label>
              </div>
            </div>
            <div class="invoice__detail" v-show="checkout.invoice.type">
              <div v-if="checkout.invoice.type === EInvoice.Personal">
                <input v-model="checkout.invoice.value.type"
                       :value="EPersonalInvoice.member"
                       type="radio"
                       name="PersonalInvoice"
                       id="MemberCarrier">
                <label class="text-base" for="MemberCarrier">會員載具</label>
                <input v-model="checkout.invoice.value.type"
                       :value="EPersonalInvoice.barcode"
                       type="radio"
                       name="PersonalInvoice"
                       id="Barcode">
                <label class="text-base" for="Barcode">手機條碼</label>
                <div v-show="checkout.invoice.value.type">
                  <template v-if="checkout.invoice.value.type===EPersonalInvoice.member">
                    中獎發票寄送地址：
                  </template>
                  <template v-else-if="checkout.invoice.value.type===EPersonalInvoice.barcode">
                    手機條碼：
                  </template>
                  <input class="rounded w-full h-8 px-3 py-2 focus:outline-none"
                         type="text"
                         v-model="checkout.invoice.value.value">
                </div>
              </div>
              <div v-else>
                <label class="text-base" for="TaxId">公司統編：</label>
                <input class="rounded w-full h-6 px-3 py-4 focus:outline-none"
                       v-model="checkout.invoice.value.value"
                       type="text"
                       name="TaxId"
                       id="TaxId">
              </div>
            </div>
          </div>
        </div>
        <div class="checkout__item checkout__item--delivery pb-3">
          <div class="checkout__title text-lg -mx-6">
            配送方式
          </div>
          <div class="checkout__content py-6">
            <div class="flex">
              <div class="delivery__item mr-4">
                <input v-model="checkout.delivery.type"
                       :value="EDelivery.Home"
                       type="radio"
                       name="delivery"
                       id="DeliveryHome">
                <label class="text-base" for="DeliveryHome">宅配</label>
              </div>
              <div class="delivery__item">
                <input v-model="checkout.delivery.type"
                       :value="EDelivery.ConvenienceStore"
                       type="radio"
                       name="delivery"
                       id="DeliveryConvenienceStore">
                <label class="text-base" for="DeliveryConvenienceStore">超商取貨</label>
              </div>
            </div>
            <div class="delivery__detail" v-show="checkout.delivery.type">
              <template v-if="checkout.delivery.type === EDelivery.Home">
                宅配地址：
              </template>
              <template v-else-if="checkout.delivery.type === EDelivery.ConvenienceStore">
                取貨超商：
              </template>
              <input class="rounded w-full h-8 px-3 py-2 focus:outline-none" type="text"
                     v-model="checkout.delivery.address">
            </div>
          </div>
        </div>
        <div class="checkout__item checkout__item--recipient pb-3">
          <div class="checkout__title text-lg -mx-6">
            收件資訊
          </div>
          <div class="checkout__content py-6">
            <div class="delivery__item">
              <div class="mb-4">
                <label class="text-base" for="RecipientName">收件人：</label>
                <input class="rounded w-full h-8 px-3 py-2 focus:outline-none"
                       v-model="checkout.recipient.name"
                       type="text"
                       id="RecipientName">
              </div>
              <div>
                <label class="text-base" for="RecipientPhone">行動電話：</label>
                <input class="rounded w-full h-8 px-3 py-2 focus:outline-none"
                       v-model="checkout.recipient.phone"
                       type="tel"
                       id="RecipientPhone">
              </div>
            </div>
          </div>
        </div>
        <div class="checkout__item checkout__item--result pb-3 border-t-2 border-gray-300">
          <div class="flex flex-col items-end">
            <div class="flex">
              <h3>商品總金額：</h3>
              <div>$ {{ checkout.totalPrice }}</div>
            </div>
            <div class="flex">
              <h3>運費總金額：</h3>
              <div>$ {{ checkout.delivery.cost }}</div>
            </div>
            <div class="flex">
              <h3>訂單總金額：</h3>
              <div>$ {{ totalPrice }}</div>
            </div>
            <div>
              <button class="rounded bg-gray-700 text-white p-2" type="button" @click="checkOrder">下訂單</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.checkout__title {
  background-color: black;
  color: white;
  padding: 12px 24px;
}
</style>
