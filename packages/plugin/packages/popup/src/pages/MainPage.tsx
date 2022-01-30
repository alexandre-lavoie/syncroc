import { IPageProps } from "@syncroc/common";
import { useNavigate } from "react-router-dom";

export default function MainPage({ state }: IPageProps) {
    const navigate = useNavigate();

    return (
        <div style={{ width: "400px", height: "400px" }}>
            <button onClick={() => navigate("/record")}>Record</button>
        </div>
    );
}
