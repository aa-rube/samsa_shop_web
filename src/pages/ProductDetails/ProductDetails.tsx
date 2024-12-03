import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BusketButton from "../../components/BusketButton/BusketButton";
import { currency, MethodType, request } from "../../data/data";
import "./productStyles.scss";

export default function ProductDetails({ chatId }: { chatId: number }) {
  const { state }: any = useLocation();

  const [productData, setProductData] = useState(state);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState<any>(0);
  const [count, setCount] = useState(0);
  const [cart, setCart] = useState<any>();

  useEffect(() => {
    request(
      MethodType.POST,
      "showcase/item",
      { item_id: state?.id },
      (result) => {
        setProductData(result);
      }
    );
  }, []);

  useEffect(() => {
    request(
      MethodType.POST,
      "cart",
      {
        chat_id: chatId,
      },
      (result) => {
        const productCount =
          result?.cartItems.find((item: any) => item.item_id === productData.id)
            ?.quantity ?? 0;
        setCount(productCount);
        setPrice(productCount * productData.price);
        setCart(result);
      }
    );
  }, []);

  //@ts-ignore
  const goBack = (e: any) => {
    e?.stopPropagation();
    navigate("/home");
  };

  const addToCart = () => {
    request(
      MethodType.PUT,
      "cart",
      {
        chat_id: chatId,
        item_id: productData.id,
      },
      (result) => {
        const productCount =
          result?.cartItems.find((item: any) => item.item_id === productData.id)
            ?.quantity ?? 0;
        setCount(productCount);
        setPrice(productCount * productData.price);
        setCart(result);
      }
    );
  };

  const removeFromCart = () => {
    request(
      MethodType.DELETE,
      `cart/${chatId}/items/${productData.id}`,
      {},
      (result) => {
        const productCount =
          result?.cartItems.find((item: any) => item.item_id === productData.id)
            ?.quantity ?? 0;
        setCount(productCount);
        setPrice(productCount * productData.price);
        setCart(result);
      }
    );
  };

  const handleClickToBusket = (e: any) => {
    // navigate(`/basket/${productId}`, {
    //   state: { productId },
    e.stopPropagation();
    setIsLoading(true);
    setTimeout(() => {
      addToCart();
      setIsLoading(false);
    }, 1000);
    // });
  };

  const handleClickIncrement = (e: any) => {
    e.stopPropagation();
    setIsLoading(true);
    setTimeout(() => {
      addToCart();
      setIsLoading(false);
    }, 1000);
  };

  const handleClickDecrement = (e: any) => {
    e.stopPropagation();
    setIsLoading(true);
    setTimeout(() => {
      removeFromCart();
      setIsLoading(false);
    }, 1000);
  };

  const handleClickBusketBtn = () => {
    navigate("/busket");
  };

  return (
    <div className="product-details__container">
      <button
        onClick={goBack}
        className="close-icon__container"
        onTouchStart={(e) => {
          //@ts-ignore
          e.target.style.boxShadow = "none";
        }}
        onTouchEnd={(e) => {
          //@ts-ignore
          e.target.style.boxShadow = "-6px -4px 6px 0 rgb(0 0 0/51%)";
        }}
      >
        <img
          src={require("../../images/closeIcon.svg").default}
          width={20}
          height={50}
        />
      </button>
      <div className="image__container">
        <img
          src={productData?.images?.length ? productData?.images[0] : ""}
          style={{ width: "100%", height: "300px", objectFit: "contain" }}
        />
        <div className="text__container">
          <h1>
            {currency} {productData.price}
          </h1>
          <p className="title">{productData.name}</p>
          <p>{productData.description}</p>
        </div>
      </div>
      {count === 0 ? (
        <button className="add-to-busket__button" onClick={handleClickToBusket}>
          {isLoading ? <div className="loader"></div> : `В корзину (${count})`}
        </button>
      ) : (
        <div className="add-to-busket__container">
          <p>
            {currency} {price}
          </p>

          <div className={`count_container ${count && "loading_buttons"}`}>
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              <>
                <button onClick={handleClickDecrement}>-</button>
                <span>{count}</span>
                <button onClick={handleClickIncrement}>+</button>
              </>
            )}
          </div>
        </div>
      )}
      <BusketButton
        title={`КОРЗИНА (${cart?.total_quantity || 0})`}
        onClick={handleClickBusketBtn}
      />
    </div>
  );
}
