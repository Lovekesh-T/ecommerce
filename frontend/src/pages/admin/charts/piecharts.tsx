import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import { categories } from "../../../assets/data.json";
import { useSelector } from "react-redux";
import { RootType } from "../../../redux/store";
import { usePieQuery } from "../../../redux/api/dashboardAPI";
import toast from "react-hot-toast";
import { CustomError } from "../../../types/api.types";
import { Skeleon } from "../../../components/Loader";

const PieCharts = () => {
  const { user } = useSelector((state: RootType) => state.userReducer);
  const {
    data: { data: pieCharts } = {},
    error,
    isError,
    isLoading,
  } = usePieQuery(user?._id as string);

  if (isError) toast.error((error as CustomError).data.message);
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        {isLoading ? (
          <Skeleon length={20} />
        ) : (
          pieCharts !== undefined && (
            <>
              <h1>Pie & Doughnut Charts</h1>
              <section>
                <div>
                  <PieChart
                    labels={["Processing", "Shipped", "Delivered"]}
                    data={Object.values(pieCharts?.orderFullfillment)}
                    backgroundColor={[
                      `hsl(110,80%, 80%)`,
                      `hsl(110,80%, 50%)`,
                      `hsl(110,40%, 50%)`,
                    ]}
                    offset={[0, 0, 50]}
                  />
                </div>
                <h2>Order Fulfillment Ratio</h2>
              </section>

              <section>
                <div>
                  <DoughnutChart
                    labels={pieCharts.productCategories.map((i) => {
                      const [heading] = Object.entries(i)[0];
                      return heading;
                    })}
                    data={pieCharts.productCategories.map((i) => {
                      const value = Object.entries(i)[0][1];
                      return value;
                    })}
                    backgroundColor={categories.map(
                      (i) => `hsl(${i.value * 4}, ${i.value}%, 50%)`
                    )}
                    legends={false}
                    offset={[0, 0, 0, 80]}
                  />
                </div>
                <h2>Product Categories Ratio</h2>
              </section>

              <section>
                <div>
                  <DoughnutChart
                    labels={["In Stock", "Out Of Stock"]}
                    data={Object.values(pieCharts.stockAvailability)}
                    backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                    legends={false}
                    offset={[0, 80]}
                    cutout={"70%"}
                  />
                </div>
                <h2> Stock Availability</h2>
              </section>

              <section>
                <div>
                  <DoughnutChart
                    labels={[
                      "Net Margin",
                      "Discount",
                      "Production Cost",
                      "Burnt",
                      "Marketing Cost",
                    ]}
                    data={Object.values(pieCharts.revenueDistribution)}
                    backgroundColor={[
                      "hsl(110,80%,40%)",
                      "hsl(19,80%,40%)",
                      "hsl(69,80%,40%)",
                      "hsl(300,80%,40%)",
                      "rgb(53, 162, 255)",
                    ]}
                    legends={false}
                    offset={[20, 30, 20, 30, 80]}
                  />
                </div>
                <h2>Revenue Distribution</h2>
              </section>

              <section>
                <div>
                  <PieChart
                    labels={[
                      "Teenager(Below 20)",
                      "Adult (20-40)",
                      "Older (above 40)",
                    ]}
                    data={Object.values(pieCharts.usersAgeGroup)}
                    backgroundColor={[
                      `hsl(10, ${80}%, 80%)`,
                      `hsl(10, ${80}%, 50%)`,
                      `hsl(10, ${40}%, 50%)`,
                    ]}
                    offset={[0, 0, 50]}
                  />
                </div>
                <h2>Users Age Group</h2>
              </section>

              <section>
                <div>
                  <DoughnutChart
                    labels={["Admin", "Customers"]}
                    data={Object.values(pieCharts.adminCustomer)}
                    backgroundColor={[
                      `hsl(335, 100%, 38%)`,
                      "hsl(44, 98%, 50%)",
                    ]}
                    offset={[0, 50]}
                  />
                </div>
              </section>
            </>
          )
        )}
      </main>
    </div>
  );
};

export default PieCharts;
