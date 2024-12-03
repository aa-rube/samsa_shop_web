import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isTimeInRange, MethodType, request } from "../../data/data";
import BasketProduct from "./basketProduct/BasketProduct";

export default function Basket({ userData }: any) {
  const chatId = userData?.id;
  const navigate = useNavigate();

  const [cart, setCart] = useState<any>();

  const goToHome = () => {
    navigate("/home");
  };

  const continueBuying = () => {
    navigate("/placeOrder");
  };

  const handleSubmitOrder = () => {
    request(MethodType.POST, "order", { chatId: chatId }, (result) => {
      if (result.success) {
        if (
          window.Telegram &&
          window.Telegram.WebApp &&
          window.Telegram.WebApp.close
        ) {
          window.Telegram.WebApp.close();
        } else {
          console.error("Telegram WebApp API недоступен.");
        }
      } else {
        console.error("Ошибка при оформлении заказа:", result.error);
      }
    });
  };

  const getCartData = () => {
    request(
      MethodType.POST,
      "cart",
      {
        chat_id: chatId,
      },
      (result) => setCart(result)
    );
  };

  useLayoutEffect(() => {
    getCartData();
  }, []);

  return (
    <div className="busket__container">
      <div className="busket__first_child">
        <div className="header">
          <h2>Корзина</h2>
          <button onClick={goToHome}>Продолжить покупки</button>
        </div>
        <div className="busket-items_container">
          {cart?.cartItems.map((e: any) => {
            return (
              <BasketProduct chatId={chatId} product={e} setCart={setCart} />
            );
          })}
        </div>
        <div className="separator"></div>
        <p className="count">В корзине {cart?.total_quantity} товаров</p>
        <h3 className="price">Итого: {cart?.total_price}</h3>

        {isTimeInRange("10:00", "17:59") ? (
          <button onClick={handleSubmitOrder} className="to-order__button">
            <span>К оформлению</span>
            <img
              src={require("../../images/right-arrow.svg").default}
              width={15}
              alt=""
            />
          </button>
        ) : (
          <p className="description">
            Заказы принимаются с 10:00 до 18:00 вечера. Спасибо!
          </p>
        )}

      </div>
      {/* <div className="footer"> */}
      <p className="contact-info">
        <p className="number_title">По всем вопросам</p>
        <p className="number">@Ann_A01</p>
      </p>
    </div>
  );
}
